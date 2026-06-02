import { type RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, VerifyPaymentDto } from './dto/payments.dto';
import { Request } from 'express';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initializePayment(user: any, dto: InitializePaymentDto): Promise<{
        message: string;
        data: {
            payment: {
                id: string;
                transactionRef: string;
                amount: number;
                status: import("@prisma/client").$Enums.PaymentStatus;
            };
            checkoutUrl: string;
            accessCode: string;
        };
    }>;
    verifyPayment(dto: VerifyPaymentDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    handleWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        success: boolean;
    }>;
    getTransactions(user: any): Promise<{
        message: string;
        data: ({
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
        })[];
    }>;
}
