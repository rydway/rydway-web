export declare class SubmitRenterKycDto {
    licenseNumber: string;
    licenseExpiry: string;
    licenseDocumentUrl: string;
    selfieUrl: string;
}
export declare class SubmitHostKycDto {
    businessName: string;
    cacNumber: string;
    taxId: string;
    cacDocumentUrl: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}
export declare class ReviewKycDto {
    reviewNotes?: string;
}
