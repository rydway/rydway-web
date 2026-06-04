import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class PayoutsService {
    private prisma;
    private redisService;
    private auditLogService;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService, auditLogService: AuditLogService);
    getHostEarningsSummary(userId: string): Promise<{
        totalEarned: number;
        totalWithdrawn: number;
        pendingWithdrawal: number;
        availableBalance: number;
    }>;
    getHostTransactions(userId: string): Promise<({
        booking: {
            bookingNumber: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        hostId: string;
        bookingId: string | null;
        transactionRef: string | null;
        provider: string | null;
        amount: number;
        idempotencyKey: string | null;
        destinationBankName: string | null;
        destinationAccountNumber: string | null;
        destinationAccountName: string | null;
    })[]>;
    private get paystackSecretKey();
    private get paystackHeaders();
    private createPaystackRecipient;
    private initiatePaystackTransfer;
    requestWithdrawal(userId: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        hostId: string;
        bookingId: string | null;
        transactionRef: string | null;
        provider: string | null;
        amount: number;
        idempotencyKey: string | null;
        destinationBankName: string | null;
        destinationAccountNumber: string | null;
        destinationAccountName: string | null;
    }>;
    getAllPayouts(status?: string): Promise<({
        host: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessName: string | null;
            cacNumber: string | null;
            taxId: string | null;
            cacDocumentUrl: string | null;
            bankName: string | null;
            accountName: string | null;
            accountNumber: string | null;
            avgRating: number;
            totalReviews: number;
            subscriptionTier: import("@prisma/client").$Enums.SubscriptionTier;
            subscriptionExpiresAt: Date | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        hostId: string;
        bookingId: string | null;
        transactionRef: string | null;
        provider: string | null;
        amount: number;
        idempotencyKey: string | null;
        destinationBankName: string | null;
        destinationAccountNumber: string | null;
        destinationAccountName: string | null;
    })[]>;
    markPayoutPaid(adminId: string, payoutId: string, transactionRef?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        hostId: string;
        bookingId: string | null;
        transactionRef: string | null;
        provider: string | null;
        amount: number;
        idempotencyKey: string | null;
        destinationBankName: string | null;
        destinationAccountNumber: string | null;
        destinationAccountName: string | null;
    }>;
    handleWebhook(provider: string, payload: any): Promise<boolean>;
}
