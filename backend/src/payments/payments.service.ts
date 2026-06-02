import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { InitializePaymentDto, VerifyPaymentDto } from './dto/payments.dto';
import { PaymentStatus, BookingStatus } from '@prisma/client';

const PAYSTACK_BASE = 'https://api.paystack.co';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
  ) {}

  private get paystackSecretKey(): string {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured');
    return key;
  }

  private generateTransactionRef(): string {
    return `RW-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  /**
   * Calls Paystack /transaction/initialize and returns a checkout URL.
   */
  async initializePayment(userId: string, dto: InitializePaymentDto, idempotencyKey: string) {
    const cacheKey = `idempotency:payment:${idempotencyKey}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { renter: { select: { email: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.renterId !== userId) {
      throw new BadRequestException('You cannot pay for this booking');
    }

    if (booking.status !== BookingStatus.confirmed) {
      throw new BadRequestException(
        `Booking must be confirmed before payment (current: ${booking.status})`,
      );
    }

    if (booking.paymentStatus === PaymentStatus.success) {
      throw new BadRequestException('Booking is already paid');
    }

    const transactionRef = this.generateTransactionRef();

    // Create a pending payment record first
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        transactionRef,
        provider: 'paystack',
        method: dto.method,
        amount: booking.totalAmount,
        status: PaymentStatus.pending,
        idempotencyKey,
      },
    });

    // Call Paystack Initialize Transaction API
    const paystackPayload = {
      email: booking.renter.email,
      amount: Math.round(booking.totalAmount * 100), // Paystack expects kobo (smallest currency unit)
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

      const result = (await response.json()) as {
        status: boolean;
        message: string;
        data?: { authorization_url: string; access_code: string; reference: string };
      };

      if (!result.status || !result.data) {
        this.logger.error('Paystack initialization failed', result.message);
        throw new BadRequestException(`Payment initialization failed: ${result.message}`);
      }

      checkoutUrl = result.data.authorization_url;
      accessCode = result.data.access_code;
    } catch (err: any) {
      this.logger.error('Failed to contact Paystack API', err.message);
      // Fallback checkout URL for development without live keys
      if (process.env.NODE_ENV !== 'production') {
        checkoutUrl = `https://checkout.paystack.com/dev-mock/${transactionRef}`;
        accessCode = `dev-access-${transactionRef}`;
        this.logger.warn(`DEV MODE: Using mock Paystack URL — ${checkoutUrl}`);
      } else {
        throw err;
      }
    }

    await this.auditLogService.logAction({
      actorId: userId,
      action: 'PAYMENT_INITIALIZED',
      entityType: 'Payment',
      entityId: payment.id,
    });

    const result = {
      payment: {
        id: payment.id,
        transactionRef: payment.transactionRef,
        amount: payment.amount,
        status: payment.status,
      },
      checkoutUrl,
      accessCode,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 86400);

    return result;
  }

  /**
   * Verifies a payment by calling Paystack /transaction/verify/:reference.
   */
  async verifyPayment(transactionRef: string, providerResponsePayload?: any) {
    // Idempotency check with Redis lock
    const lockKey = `payment:idempotency:${transactionRef}`;
    const acquired = await this.redisService.setnx(lockKey, '1');
    if (!acquired) {
      throw new ConflictException('Payment is currently being processed');
    }
    await this.redisService.expire(lockKey, 30); // 30s lock

    try {
      const payment = await this.prisma.payment.findUnique({
        where: { transactionRef },
        include: { booking: true },
      });

      if (!payment) throw new NotFoundException('Payment not found');
      if (payment.status === PaymentStatus.success) {
        return payment; // Already processed — idempotent
      }

      // Verify with Paystack API
      let isSuccessful = false;
      let rawPayload = providerResponsePayload;

      try {
        const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${transactionRef}`, {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        });

        const result = (await response.json()) as {
          status: boolean;
          data?: { status: string; amount: number; reference: string };
        };

        rawPayload = result;
        isSuccessful = result.status && result.data?.status === 'success';

        if (isSuccessful) {
          // Sanity check: verify amount matches (in kobo)
          const expectedKobo = Math.round(payment.amount * 100);
          if (result.data && result.data.amount !== expectedKobo) {
            this.logger.warn(
              `Amount mismatch for ${transactionRef}: expected ${expectedKobo}, got ${result.data.amount}`,
            );
            isSuccessful = false;
          }
        }
      } catch (err: any) {
        this.logger.error('Failed to verify with Paystack API', err.message);
        // In dev mode, allow a bypass
        if (process.env.NODE_ENV !== 'production') {
          isSuccessful = true;
          this.logger.warn('DEV MODE: Bypassing Paystack verification');
        } else {
          throw err;
        }
      }

      if (!isSuccessful) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.failed, rawPayloadJson: rawPayload },
        });
        throw new BadRequestException('Payment verification failed — transaction not successful');
      }

      const updatedPayment = await this.prisma.$transaction(async (tx) => {
        const p = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.success,
            paidAt: new Date(),
            rawPayloadJson: rawPayload,
          },
        });

        await tx.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: BookingStatus.paid,
            paymentStatus: PaymentStatus.success,
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
    } finally {
      await this.redisService.del(lockKey);
    }
  }

  /**
   * Handles Paystack webhook events.
   * Verifies the Paystack HMAC-SHA512 signature before processing.
   */
  async handleWebhook(rawBody: string, signature: string) {
    // Verify Paystack signature
    const expectedSignature = createHmac('sha512', this.paystackSecretKey)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody);
    const event = payload?.event;
    const transactionRef = payload?.data?.reference;
    const eventId = payload?.data?.id ? String(payload.data.id) : `${transactionRef}-${event}-${Date.now()}`;

    try {
      await this.prisma.webhookEvent.create({
        data: {
          provider: 'paystack',
          eventId,
          payload: payload,
          status: 'pending',
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        this.logger.warn(`Webhook ${eventId} already processed (idempotent).`);
        return { handled: true, duplicate: true };
      }
      throw error;
    }

    this.logger.log(`Paystack webhook received: ${event} for ref ${transactionRef}`);

    try {
      if (event === 'charge.success' && transactionRef) {
        await this.verifyPayment(transactionRef, payload);
      }
      
      await this.prisma.webhookEvent.update({
        where: { eventId },
        data: { status: 'processed' },
      });
    } catch (error: any) {
      await this.prisma.webhookEvent.update({
        where: { eventId },
        data: { status: 'failed', error: error.message },
      });
      throw error;
    }

    // Other events (e.g. transfer.success, refund) can be handled here
    return { handled: true, event };
  }

  async getTransactionHistory(userId: string) {
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
}
