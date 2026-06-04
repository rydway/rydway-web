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
var WebhookReconciliationCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookReconciliationCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const payments_service_1 = require("./payments.service");
let WebhookReconciliationCron = WebhookReconciliationCron_1 = class WebhookReconciliationCron {
    prisma;
    paymentsService;
    logger = new common_1.Logger(WebhookReconciliationCron_1.name);
    constructor(prisma, paymentsService) {
        this.prisma = prisma;
        this.paymentsService = paymentsService;
    }
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
            }
            catch (error) {
                this.logger.error(`Failed to reconcile payment ${payment.transactionRef}: ${error.message}`);
            }
        }
    }
};
exports.WebhookReconciliationCron = WebhookReconciliationCron;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebhookReconciliationCron.prototype, "handleMissingWebhooks", null);
exports.WebhookReconciliationCron = WebhookReconciliationCron = WebhookReconciliationCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payments_service_1.PaymentsService])
], WebhookReconciliationCron);
//# sourceMappingURL=webhook-reconciliation.cron.js.map