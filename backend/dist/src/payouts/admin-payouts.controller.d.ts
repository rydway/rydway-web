import { PayoutsService } from './payouts.service';
import { MarkPayoutPaidDto } from './dto/payouts.dto';
export declare class AdminPayoutsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    getAllPayouts(status?: string): Promise<{
        message: string;
        data: ({
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
        })[];
    }>;
    markPayoutPaid(admin: any, id: string, dto: MarkPayoutPaidDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
