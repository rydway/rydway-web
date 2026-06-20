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
        provider: string | null;
        transactionRef: string | null;
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
        provider: string | null;
        transactionRef: string | null;
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
            legalBusinessName: string | null;
            tradingName: string | null;
            businessType: string | null;
            rcNumber: string | null;
            dateOfIncorporation: Date | null;
            businessState: string | null;
            businessCity: string | null;
            businessAddress: string | null;
            businessPhone: string | null;
            businessEmail: string | null;
            tin: string | null;
            vatStatus: string | null;
            frscFleetStatus: string | null;
            stateTransportPermit: string | null;
            ownerName: string | null;
            ownerPhone: string | null;
            ownerNIN: string | null;
            ownerDOB: Date | null;
            ownerEmail: string | null;
            ownershipPercentage: number | null;
            cacCertificateUrl: string | null;
            cacStatusReportUrl: string | null;
            utilityBillUrl: string | null;
            taxClearanceCertificateUrl: string | null;
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
        provider: string | null;
        transactionRef: string | null;
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
        provider: string | null;
        transactionRef: string | null;
        amount: number;
        idempotencyKey: string | null;
        destinationBankName: string | null;
        destinationAccountNumber: string | null;
        destinationAccountName: string | null;
    }>;
    handleWebhook(provider: string, payload: any): Promise<boolean>;
}
