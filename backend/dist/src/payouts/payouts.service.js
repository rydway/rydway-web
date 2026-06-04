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
var PayoutsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const client_1 = require("@prisma/client");
let PayoutsService = PayoutsService_1 = class PayoutsService {
    prisma;
    redisService;
    auditLogService;
    logger = new common_1.Logger(PayoutsService_1.name);
    constructor(prisma, redisService, auditLogService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.auditLogService = auditLogService;
    }
    async getHostEarningsSummary(userId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile)
            throw new common_1.NotFoundException('Host profile not found');
        const bookingsWithOpenDispute = await this.prisma.booking.findMany({
            where: { dispute: { status: 'OPEN' } },
            select: { id: true },
        });
        const openDisputeBookingIds = bookingsWithOpenDispute.map((b) => b.id);
        const completedBookings = await this.prisma.booking.findMany({
            where: {
                hostId: hostProfile.id,
                status: client_1.BookingStatus.completed,
                id: {
                    notIn: openDisputeBookingIds,
                },
            },
            select: { baseAmount: true },
        });
        const totalEarned = completedBookings.reduce((sum, b) => sum + b.baseAmount, 0);
        const payouts = await this.prisma.payout.findMany({
            where: { hostId: hostProfile.id },
            select: { amount: true, status: true },
        });
        const totalWithdrawn = payouts
            .filter((p) => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
        const pendingWithdrawal = payouts
            .filter((p) => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);
        const availableBalance = totalEarned - totalWithdrawn - pendingWithdrawal;
        return {
            totalEarned,
            totalWithdrawn,
            pendingWithdrawal,
            availableBalance: availableBalance > 0 ? availableBalance : 0,
        };
    }
    async getHostTransactions(userId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile)
            return [];
        return this.prisma.payout.findMany({
            where: { hostId: hostProfile.id },
            orderBy: { createdAt: 'desc' },
            include: { booking: { select: { bookingNumber: true } } },
        });
    }
    get paystackSecretKey() {
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key)
            throw new Error('PAYSTACK_SECRET_KEY is not configured');
        return key;
    }
    get paystackHeaders() {
        return {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
        };
    }
    async createPaystackRecipient(accountName, accountNumber, bankCode) {
        const response = await fetch('https://api.paystack.co/transferrecipient', {
            method: 'POST',
            headers: this.paystackHeaders,
            body: JSON.stringify({
                type: 'nuban',
                name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: 'NGN',
            }),
        });
        const result = (await response.json());
        if (!result.status || !result.data?.recipient_code) {
            throw new common_1.BadRequestException('Failed to create Paystack transfer recipient');
        }
        return result.data.recipient_code;
    }
    async initiatePaystackTransfer(recipientCode, amountNgn, reference, reason) {
        const response = await fetch('https://api.paystack.co/transfer', {
            method: 'POST',
            headers: this.paystackHeaders,
            body: JSON.stringify({
                source: 'balance',
                amount: Math.round(amountNgn * 100),
                recipient: recipientCode,
                reference,
                reason,
            }),
        });
        const result = (await response.json());
        if (!result.status || !result.data?.transfer_code) {
            throw new common_1.BadRequestException('Failed to initiate Paystack transfer');
        }
        return result.data.transfer_code;
    }
    async requestWithdrawal(userId, amount) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile)
            throw new common_1.NotFoundException('Host profile not found');
        if (!hostProfile.accountNumber || !hostProfile.bankName) {
            throw new common_1.BadRequestException('Please update your bank details in your host profile before withdrawing');
        }
        const lockKey = `payout:withdraw:${hostProfile.id}`;
        const acquired = await this.redisService.setnx(lockKey, '1');
        if (!acquired) {
            throw new common_1.BadRequestException('A withdrawal request is already being processed');
        }
        await this.redisService.expire(lockKey, 60);
        try {
            const summary = await this.getHostEarningsSummary(userId);
            if (amount > summary.availableBalance) {
                throw new common_1.BadRequestException('Insufficient available balance');
            }
            const transactionRef = `RW-PAYOUT-${Date.now()}-${hostProfile.id.slice(0, 8)}`;
            const payout = await this.prisma.payout.create({
                data: {
                    hostId: hostProfile.id,
                    amount,
                    status: 'pending',
                    transactionRef,
                    destinationBankName: hostProfile.bankName,
                    destinationAccountNumber: hostProfile.accountNumber,
                    destinationAccountName: hostProfile.accountName,
                },
            });
            await this.auditLogService.logAction({
                actorId: userId,
                action: 'WITHDRAWAL_REQUESTED',
                entityType: 'Payout',
                entityId: payout.id,
            });
            const isDevMode = process.env.NODE_ENV !== 'production' &&
                (!process.env.PAYSTACK_SECRET_KEY ||
                    process.env.PAYSTACK_SECRET_KEY.startsWith('dev-') ||
                    process.env.PAYSTACK_SECRET_KEY.startsWith('mock-') ||
                    process.env.PAYSTACK_SECRET_KEY === 'your_paystack_secret_key_here');
            if (!isDevMode) {
                try {
                    const bankCode = hostProfile.bankCode ?? hostProfile.bankName;
                    const recipientCode = await this.createPaystackRecipient(hostProfile.accountName ?? `${hostProfile.id}`, hostProfile.accountNumber, bankCode);
                    const transferCode = await this.initiatePaystackTransfer(recipientCode, amount, transactionRef, `Rydway host payout — ${payout.id}`);
                    await this.prisma.payout.update({
                        where: { id: payout.id },
                        data: { transactionRef: transferCode },
                    });
                    await this.auditLogService.logAction({
                        actorId: userId,
                        action: 'PAYOUT_TRANSFER_INITIATED',
                        entityType: 'Payout',
                        entityId: payout.id,
                    });
                }
                catch (err) {
                    await this.prisma.payout.update({
                        where: { id: payout.id },
                        data: { status: 'failed' },
                    });
                    await this.auditLogService.logAction({
                        actorId: userId,
                        action: 'PAYOUT_TRANSFER_FAILED',
                        entityType: 'Payout',
                        entityId: payout.id,
                    });
                    throw new common_1.BadRequestException(`Payout transfer failed: ${err.message}`);
                }
            }
            else {
                this.logger.warn(`DEV MODE: Paystack transfer skipped for payout ${payout.id} — amount ₦${amount}`);
            }
            return payout;
        }
        finally {
            await this.redisService.del(lockKey);
        }
    }
    async getAllPayouts(status) {
        const where = status ? { status } : {};
        return this.prisma.payout.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { host: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
        });
    }
    async markPayoutPaid(adminId, payoutId, transactionRef) {
        const payout = await this.prisma.payout.findUnique({ where: { id: payoutId } });
        if (!payout)
            throw new common_1.NotFoundException('Payout not found');
        if (payout.status !== 'pending') {
            throw new common_1.BadRequestException(`Payout is already ${payout.status}`);
        }
        const updated = await this.prisma.payout.update({
            where: { id: payoutId },
            data: {
                status: 'paid',
                transactionRef,
            },
        });
        await this.auditLogService.logAction({
            actorId: adminId,
            action: 'PAYOUT_MARKED_PAID',
            entityType: 'Payout',
            entityId: payoutId,
        });
        return updated;
    }
    async handleWebhook(provider, payload) {
        if (payload?.event === 'transfer.success') {
            const transactionRef = payload?.data?.reference;
            const payout = await this.prisma.payout.findUnique({
                where: { transactionRef },
            });
            if (payout && payout.status === 'pending') {
                await this.markPayoutPaid('system-webhook', payout.id, transactionRef);
            }
        }
        return true;
    }
};
exports.PayoutsService = PayoutsService;
exports.PayoutsService = PayoutsService = PayoutsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map