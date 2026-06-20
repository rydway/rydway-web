export declare class SubmitRenterKycDto {
    licenseNumber?: string;
    licenseExpiry?: string;
    licenseDocumentUrl?: string;
    selfieUrl: string;
    dateOfBirth?: string;
    state?: string;
    city?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    drivingChoice?: string;
    identificationType?: string;
    identificationDocumentUrl?: string;
    preferredCarType?: string;
    primaryRentalPurpose?: string;
    usageFrequency?: string;
    typicalTripType?: string;
    vehiclePreference?: string;
}
export declare class SubmitHostKycDto {
    businessName?: string;
    cacNumber?: string;
    taxId?: string;
    cacDocumentUrl?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    legalBusinessName?: string;
    tradingName?: string;
    businessType?: string;
    rcNumber?: string;
    dateOfIncorporation?: string;
    businessState?: string;
    businessCity?: string;
    businessAddress?: string;
    businessPhone?: string;
    businessEmail?: string;
    tin?: string;
    vatStatus?: string;
    frscFleetStatus?: string;
    stateTransportPermit?: string;
    ownerName?: string;
    ownerPhone?: string;
    ownerNIN?: string;
    ownerDOB?: string;
    ownerEmail?: string;
    ownershipPercentage?: number;
    cacCertificate?: string;
    cacStatusReport?: string;
    utilityBill?: string;
    taxClearanceCertificate?: string;
}
export declare class ReviewKycDto {
    reviewNotes?: string;
}
