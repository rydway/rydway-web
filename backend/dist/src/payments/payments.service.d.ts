import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { InitializePaymentDto } from './dto/payments.dto';
export declare class PaymentsService {
    private prisma;
    private redisService;
    private auditLogService;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService, auditLogService: AuditLogService);
    private get paystackSecretKey();
    private generateTransactionRef;
    initializePayment(userId: string, dto: InitializePaymentDto): Promise<{
        payment: {
            id: string;
            transactionRef: string;
            amount: number;
            status: import("@prisma/client").$Enums.PaymentStatus;
        };
        checkoutUrl: string;
        accessCode: string;
    }>;
    verifyPayment(transactionRef: string, providerResponsePayload?: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        transactionRef: string;
        provider: string;
        method: string;
        amount: number;
        currency: string;
        paidAt: Date | null;
        rawPayloadJson: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    handleWebhook(rawBody: string, signature: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        transactionRef: string;
        provider: string;
        method: string;
        amount: number;
        currency: string;
        paidAt: Date | null;
        rawPayloadJson: import("@prisma/client/runtime/client").JsonValue | null;
    } | {
        handled: boolean;
        event: any;
    }>;
    getTransactionHistory(userId: string): Promise<({
        booking: {
            status: import("@prisma/client").$Enums.BookingStatus;
            vehicle: {
                name: string;
            };
            bookingNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        transactionRef: string;
        provider: string;
        method: string;
        amount: number;
        currency: string;
        paidAt: Date | null;
        rawPayloadJson: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
