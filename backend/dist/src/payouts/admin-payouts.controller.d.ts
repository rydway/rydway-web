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
            provider: string | null;
            transactionRef: string | null;
            amount: number;
            idempotencyKey: string | null;
            destinationBankName: string | null;
            destinationAccountNumber: string | null;
            destinationAccountName: string | null;
        };
    }>;
}
