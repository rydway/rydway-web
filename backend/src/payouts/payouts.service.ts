import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class PayoutsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
  ) {}

  async getHostEarningsSummary(userId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) throw new NotFoundException('Host profile not found');

    // Total earned from all completed bookings, excluding those with OPEN disputes
    const openDisputes = await this.prisma.dispute.findMany({
      where: { status: 'OPEN' },
      select: { bookingId: true },
    });
    const openDisputeBookingIds = openDisputes.map(d => d.bookingId);

    const completedBookings = await this.prisma.booking.findMany({
      where: {
        hostId: hostProfile.id,
        status: BookingStatus.completed,
        id: {
          notIn: openDisputeBookingIds,
        },
      },
      select: { baseAmount: true },
    });

    const totalEarned = completedBookings.reduce((sum, b) => sum + b.baseAmount, 0);

    // Get payouts
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

  async getHostTransactions(userId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) return [];

    return this.prisma.payout.findMany({
      where: { hostId: hostProfile.id },
      orderBy: { createdAt: 'desc' },
      include: { booking: { select: { bookingNumber: true } } },
    });
  }

  async requestWithdrawal(userId: string, amount: number) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) throw new NotFoundException('Host profile not found');

    if (!hostProfile.accountNumber || !hostProfile.bankName) {
      throw new BadRequestException('Please update your bank details in your host profile before withdrawing');
    }

    const lockKey = `payout:withdraw:${hostProfile.id}`;
    const acquired = await this.redisService.setnx(lockKey, '1');
    if (!acquired) {
      throw new BadRequestException('A withdrawal request is already being processed');
    }
    await this.redisService.expire(lockKey, 30);

    try {
      const summary = await this.getHostEarningsSummary(userId);
      if (amount > summary.availableBalance) {
        throw new BadRequestException('Insufficient available balance');
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
    } finally {
      await this.redisService.del(lockKey);
    }
  }

  async getAllPayouts(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.payout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { host: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
    });
  }

  async markPayoutPaid(adminId: string, payoutId: string, transactionRef?: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new NotFoundException('Payout not found');

    if (payout.status !== 'pending') {
      throw new BadRequestException(`Payout is already ${payout.status}`);
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

  async handleWebhook(provider: string, payload: any) {
    // Example: verify signature, extract payout id or reference
    // For Paystack transfer.success event
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
}
