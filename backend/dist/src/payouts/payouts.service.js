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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const client_1 = require("@prisma/client");
let PayoutsService = class PayoutsService {
    prisma;
    redisService;
    auditLogService;
    constructor(prisma, redisService, auditLogService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.auditLogService = auditLogService;
    }
    async getHostEarningsSummary(userId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile)
            throw new common_1.NotFoundException('Host profile not found');
        const completedBookings = await this.prisma.booking.findMany({
            where: {
                hostId: hostProfile.id,
                status: client_1.BookingStatus.completed,
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
        await this.redisService.expire(lockKey, 30);
        try {
            const summary = await this.getHostEarningsSummary(userId);
            if (amount > summary.availableBalance) {
                throw new common_1.BadRequestException('Insufficient available balance');
            }
            const payout = await this.prisma.payout.create({
                data: {
                    hostId: hostProfile.id,
                    amount,
                    status: 'pending',
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
exports.PayoutsService = PayoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map