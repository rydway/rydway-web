import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
  ) {}

  async getHostEarningsSummary(userId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) throw new NotFoundException('Host profile not found');

    // Total earned from all completed bookings, excluding those with OPEN disputes.
    // Query through booking.dispute relation to avoid dependency on prisma.dispute
    // accessor which may not be resolved until after a fresh `prisma generate`.
    const bookingsWithOpenDispute = await this.prisma.booking.findMany({
      where: { dispute: { status: 'OPEN' } },
      select: { id: true },
    });
    const openDisputeBookingIds = bookingsWithOpenDispute.map((b: { id: string }) => b.id);

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

  // ─── Private Paystack Helpers ─────────────────────────────────────────────

  private get paystackSecretKey(): string {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured');
    return key;
  }

  private get paystackHeaders() {
    return {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Creates a Paystack transfer recipient for a Nigerian bank account.
   * Returns the recipient_code to use in subsequent transfers.
   */
  private async createPaystackRecipient(
    accountName: string,
    accountNumber: string,
    bankCode: string,
  ): Promise<string> {
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

    const result = (await response.json()) as { status: boolean; data?: { recipient_code: string } };
    if (!result.status || !result.data?.recipient_code) {
      throw new BadRequestException('Failed to create Paystack transfer recipient');
    }
    return result.data.recipient_code;
  }

  /**
   * Initiates a Paystack transfer to a recipient.
   * Returns the transfer_code for webhook-based status tracking.
   */
  private async initiatePaystackTransfer(
    recipientCode: string,
    amountNgn: number,
    reference: string,
    reason: string,
  ): Promise<string> {
    const response = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: this.paystackHeaders,
      body: JSON.stringify({
        source: 'balance',
        amount: Math.round(amountNgn * 100), // Convert to kobo
        recipient: recipientCode,
        reference,
        reason,
      }),
    });

    const result = (await response.json()) as {
      status: boolean;
      data?: { transfer_code: string; status: string };
    };

    if (!result.status || !result.data?.transfer_code) {
      throw new BadRequestException('Failed to initiate Paystack transfer');
    }
    return result.data.transfer_code;
  }

  // ─── Withdrawal Request ────────────────────────────────────────────────────

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
    await this.redisService.expire(lockKey, 60);

    try {
      const summary = await this.getHostEarningsSummary(userId);
      if (amount > summary.availableBalance) {
        throw new BadRequestException('Insufficient available balance');
      }

      const transactionRef = `RW-PAYOUT-${Date.now()}-${hostProfile.id.slice(0, 8)}`;

      // Create the pending payout record first (idempotent baseline)
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

      // ── Paystack Transfer Dispatch ───────────────────────────────────────
      const isDevMode =
        process.env.NODE_ENV !== 'production' &&
        (!process.env.PAYSTACK_SECRET_KEY ||
          process.env.PAYSTACK_SECRET_KEY.startsWith('dev-') ||
          process.env.PAYSTACK_SECRET_KEY.startsWith('mock-') ||
          process.env.PAYSTACK_SECRET_KEY === 'your_paystack_secret_key_here');

      if (!isDevMode) {
        try {
          // Step 1: create recipient using bankCode (stored in hostProfile.bankCode)
          const bankCode = (hostProfile as any).bankCode ?? hostProfile.bankName;
          const recipientCode = await this.createPaystackRecipient(
            hostProfile.accountName ?? `${hostProfile.id}`,
            hostProfile.accountNumber,
            bankCode,
          );

          // Step 2: initiate the transfer
          const transferCode = await this.initiatePaystackTransfer(
            recipientCode,
            amount,
            transactionRef,
            `Rydway host payout — ${payout.id}`,
          );

          // Step 3: store the transfer_code so the webhook can reconcile it
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
        } catch (err: any) {
          // Mark payout as failed so balance is not incorrectly tied up
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
          throw new BadRequestException(`Payout transfer failed: ${err.message}`);
        }
      } else {
        this.logger.warn(
          `DEV MODE: Paystack transfer skipped for payout ${payout.id} — amount ₦${amount}`,
        );
      }

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
