export declare class InitializePaymentDto {
    bookingId: string;
    provider: string;
    method: string;
}
export declare class VerifyPaymentDto {
    transactionRef: string;
}
export declare class CreatePaymentMethodDto {
    type: string;
    token: string;
    last4?: string;
}
