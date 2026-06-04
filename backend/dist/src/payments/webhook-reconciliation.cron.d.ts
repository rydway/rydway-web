import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';
export declare class WebhookReconciliationCron {
    private prisma;
    private paymentsService;
    private readonly logger;
    constructor(prisma: PrismaService, paymentsService: PaymentsService);
    handleMissingWebhooks(): Promise<void>;
}
