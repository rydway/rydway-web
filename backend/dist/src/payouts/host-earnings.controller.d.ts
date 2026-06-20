import { PayoutsService } from './payouts.service';
import { WithdrawEarningsDto } from './dto/payouts.dto';
export declare class HostEarningsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    getSummary(user: any): Promise<{
        message: string;
        data: {
            totalEarned: number;
            totalWithdrawn: number;
            pendingWithdrawal: number;
            availableBalance: number;
        };
    }>;
    getTransactions(user: any): Promise<{
        message: string;
        data: ({
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
        })[];
    }>;
    withdraw(user: any, dto: WithdrawEarningsDto): Promise<{
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
