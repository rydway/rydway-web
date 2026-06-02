import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';

@Injectable()
export class WebhookReconciliationCron {
  private readonly logger = new Logger(WebhookReconciliationCron.name);

  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleMissingWebhooks() {
    this.logger.log('Running webhook reconciliation cron...');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        status: 'pending',
        createdAt: { lte: oneHourAgo },
      },
    });

    for (const payment of pendingPayments) {
      try {
        await this.paymentsService.verifyPayment(payment.transactionRef);
        this.logger.log(`Successfully reconciled payment ${payment.transactionRef}`);
      } catch (error: any) {
        this.logger.error(`Failed to reconcile payment ${payment.transactionRef}: ${error.message}`);
      }
    }
  }
}
