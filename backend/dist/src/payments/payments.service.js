"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const client_1 = require("@prisma/client");
const PAYSTACK_BASE = 'https://api.paystack.co';
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    redisService;
    auditLogService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma, redisService, auditLogService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.auditLogService = auditLogService;
    }
    get paystackSecretKey() {
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key)
            throw new Error('PAYSTACK_SECRET_KEY is not configured');
        return key;
    }
    generateTransactionRef() {
        return `RW-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    }
    async initializePayment(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { renter: { select: { email: true } } },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.renterId !== userId) {
            throw new common_1.BadRequestException('You cannot pay for this booking');
        }
        if (booking.status !== client_1.BookingStatus.confirmed) {
            throw new common_1.BadRequestException(`Booking must be confirmed before payment (current: ${booking.status})`);
        }
        if (booking.paymentStatus === client_1.PaymentStatus.success) {
            throw new common_1.BadRequestException('Booking is already paid');
        }
        const transactionRef = this.generateTransactionRef();
        const payment = await this.prisma.payment.create({
            data: {
                bookingId: booking.id,
                transactionRef,
                provider: 'paystack',
                method: dto.method,
                amount: booking.totalAmount,
                status: client_1.PaymentStatus.pending,
            },
        });
        const paystackPayload = {
            email: booking.renter.email,
            amount: Math.round(booking.totalAmount * 100),
            reference: transactionRef,
            currency: 'NGN',
            callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payments/callback`,
            metadata: {
                bookingId: booking.id,
                paymentId: payment.id,
                custom_fields: [
                    {
                        display_name: 'Booking Ref',
                        variable_name: 'booking_ref',
                        value: booking.bookingNumber,
                    },
                ],
            },
            channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        };
        let checkoutUrl = '';
        let accessCode = '';
        try {
            const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paystackPayload),
            });
            const result = (await response.json());
            if (!result.status || !result.data) {
                this.logger.error('Paystack initialization failed', result.message);
                throw new common_1.BadRequestException(`Payment initialization failed: ${result.message}`);
            }
            checkoutUrl = result.data.authorization_url;
            accessCode = result.data.access_code;
        }
        catch (err) {
            this.logger.error('Failed to contact Paystack API', err.message);
            if (process.env.NODE_ENV !== 'production') {
                checkoutUrl = `https://checkout.paystack.com/dev-mock/${transactionRef}`;
                accessCode = `dev-access-${transactionRef}`;
                this.logger.warn(`DEV MODE: Using mock Paystack URL — ${checkoutUrl}`);
            }
            else {
                throw err;
            }
        }
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'PAYMENT_INITIALIZED',
            entityType: 'Payment',
            entityId: payment.id,
        });
        return {
            payment: {
                id: payment.id,
                transactionRef: payment.transactionRef,
                amount: payment.amount,
                status: payment.status,
            },
            checkoutUrl,
            accessCode,
        };
    }
    async verifyPayment(transactionRef, providerResponsePayload) {
        const lockKey = `payment:idempotency:${transactionRef}`;
        const acquired = await this.redisService.setnx(lockKey, '1');
        if (!acquired) {
            throw new common_1.ConflictException('Payment is currently being processed');
        }
        await this.redisService.expire(lockKey, 30);
        try {
            const payment = await this.prisma.payment.findUnique({
                where: { transactionRef },
                include: { booking: true },
            });
            if (!payment)
                throw new common_1.NotFoundException('Payment not found');
            if (payment.status === client_1.PaymentStatus.success) {
                return payment;
            }
            let isSuccessful = false;
            let rawPayload = providerResponsePayload;
            try {
                const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${transactionRef}`, {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`,
                    },
                });
                const result = (await response.json());
                rawPayload = result;
                isSuccessful = result.status && result.data?.status === 'success';
                if (isSuccessful) {
                    const expectedKobo = Math.round(payment.amount * 100);
                    if (result.data && result.data.amount !== expectedKobo) {
                        this.logger.warn(`Amount mismatch for ${transactionRef}: expected ${expectedKobo}, got ${result.data.amount}`);
                        isSuccessful = false;
                    }
                }
            }
            catch (err) {
                this.logger.error('Failed to verify with Paystack API', err.message);
                if (process.env.NODE_ENV !== 'production') {
                    isSuccessful = true;
                    this.logger.warn('DEV MODE: Bypassing Paystack verification');
                }
                else {
                    throw err;
                }
            }
            if (!isSuccessful) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: client_1.PaymentStatus.failed, rawPayloadJson: rawPayload },
                });
                throw new common_1.BadRequestException('Payment verification failed — transaction not successful');
            }
            const updatedPayment = await this.prisma.$transaction(async (tx) => {
                const p = await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: client_1.PaymentStatus.success,
                        paidAt: new Date(),
                        rawPayloadJson: rawPayload,
                    },
                });
                await tx.booking.update({
                    where: { id: payment.bookingId },
                    data: {
                        status: client_1.BookingStatus.paid,
                        paymentStatus: client_1.PaymentStatus.success,
                    },
                });
                return p;
            });
            await this.auditLogService.logAction({
                actorId: payment.booking.renterId,
                action: 'PAYMENT_VERIFIED_SUCCESS',
                entityType: 'Payment',
                entityId: payment.id,
            });
            return updatedPayment;
        }
        finally {
            await this.redisService.del(lockKey);
        }
    }
    async handleWebhook(rawBody, signature) {
        const expectedSignature = (0, crypto_1.createHmac)('sha512', this.paystackSecretKey)
            .update(rawBody)
            .digest('hex');
        if (expectedSignature !== signature) {
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        }
        const payload = JSON.parse(rawBody);
        const event = payload?.event;
        const transactionRef = payload?.data?.reference;
        this.logger.log(`Paystack webhook received: ${event} for ref ${transactionRef}`);
        if (event === 'charge.success' && transactionRef) {
            return this.verifyPayment(transactionRef, payload);
        }
        return { handled: false, event };
    }
    async getTransactionHistory(userId) {
        return this.prisma.payment.findMany({
            where: {
                booking: {
                    renterId: userId,
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                booking: {
                    select: {
                        bookingNumber: true,
                        status: true,
                        vehicle: { select: { name: true } },
                    },
                },
            },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map