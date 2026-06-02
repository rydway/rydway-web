import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WebhookReconciliationCron } from './webhook-reconciliation.cron';

@Module({
  providers: [PaymentsService, WebhookReconciliationCron],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
