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
    initializePayment(userId: string, dto: InitializePaymentDto, idempotencyKey: string): Promise<any>;
    verifyPayment(transactionRef: string, providerResponsePayload?: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        provider: string;
        transactionRef: string;
        method: string;
        amount: number;
        currency: string;
        paidAt: Date | null;
        rawPayloadJson: import("@prisma/client/runtime/client").JsonValue | null;
        idempotencyKey: string | null;
    }>;
    handleWebhook(rawBody: string, signature: string): Promise<{
        handled: boolean;
        duplicate: boolean;
        event?: undefined;
    } | {
        handled: boolean;
        event: any;
        duplicate?: undefined;
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
        provider: string;
        transactionRef: string;
        method: string;
        amount: number;
        currency: string;
        paidAt: Date | null;
        rawPayloadJson: import("@prisma/client/runtime/client").JsonValue | null;
        idempotencyKey: string | null;
    })[]>;
}
