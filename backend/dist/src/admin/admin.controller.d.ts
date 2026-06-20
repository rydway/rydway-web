import { AdminService } from './admin.service';
declare class UpdateUserStatusDto {
    isActive: boolean;
}
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardSummary(): Promise<{
        message: string;
        data: any;
    }>;
    getUsers(page?: string, limit?: string, role?: string, search?: string): Promise<{
        message: string;
        data: {
            items: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
                kycStatus: import("@prisma/client").$Enums.KycStatus;
                createdAt: Date;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getUserById(id: string): Promise<{
        message: string;
        data: ({
            renterProfile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                avgRating: number;
                totalReviews: number;
                userId: string;
                licenseNumber: string | null;
                licenseExpiry: Date | null;
                licenseDocumentUrl: string | null;
                selfieUrl: string | null;
                dateOfBirth: Date | null;
                state: string | null;
                city: string | null;
                address: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                drivingChoice: string | null;
                identificationType: string | null;
                identificationDocumentUrl: string | null;
                preferredCarType: string | null;
                primaryRentalPurpose: string | null;
                usageFrequency: string | null;
                typicalTripType: string | null;
                vehiclePreference: string | null;
            } | null;
            hostProfile: {
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
            } | null;
            kycSubmissions: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: import("@prisma/client").$Enums.KycStatus;
                type: import("@prisma/client").$Enums.KycType;
                submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
                reviewedBy: string | null;
                reviewNotes: string | null;
                reviewedAt: Date | null;
            }[];
        } & {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            profileImageUrl: string | null;
            isActive: boolean;
            isSuspended: boolean;
            suspensionReason: string | null;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        }) | null;
    }>;
    updateUserStatus(admin: any, id: string, dto: UpdateUserStatusDto): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            profileImageUrl: string | null;
            isActive: boolean;
            isSuspended: boolean;
            suspensionReason: string | null;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    getAllKyc(page?: string, limit?: string, status?: string): Promise<{
        message: string;
        data: {
            items: ({
                user: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                    role: import("@prisma/client").$Enums.Role;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: import("@prisma/client").$Enums.KycStatus;
                type: import("@prisma/client").$Enums.KycType;
                submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
                reviewedBy: string | null;
                reviewNotes: string | null;
                reviewedAt: Date | null;
            })[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getAllVehicles(page?: string, limit?: string, verified?: string): Promise<{
        message: string;
        data: {
            items: ({
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
                images: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    position: number;
                    isPrimary: boolean;
                    vehicleId: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                avgRating: number;
                totalReviews: number;
                slug: string;
                category: string;
                fuelType: string;
                transmission: string;
                seats: number;
                dailyRate: number;
                securityDeposit: number;
                location: string;
                latitude: number | null;
                longitude: number | null;
                description: string | null;
                status: import("@prisma/client").$Enums.VehicleStatus;
                isFeatured: boolean;
                isVerified: boolean;
                requiresDriver: boolean;
                minimumRentalDays: number;
                hostId: string;
            })[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getAllBookings(page?: string, limit?: string, status?: string): Promise<{
        message: string;
        data: {
            items: ({
                renter: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                vehicle: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                hostId: string;
                bookingNumber: string;
                startDate: Date;
                endDate: Date;
                pickupTime: string;
                dropoffTime: string;
                pickupLocation: string;
                dropoffLocation: string;
                daysCount: number;
                baseAmount: number;
                platformFeeAmount: number;
                securityDepositAmount: number;
                totalAmount: number;
                paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
                approvalStatus: string;
                confirmedAt: Date | null;
                startedAt: Date | null;
                completedAt: Date | null;
                cancelledAt: Date | null;
                renterId: string;
                vehicleId: string;
            })[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getAllPayments(page?: string, limit?: string): Promise<{
        message: string;
        data: {
            items: ({
                booking: {
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
            })[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getAllPayouts(page?: string, limit?: string, status?: string): Promise<{
        message: string;
        data: {
            items: ({
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
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getAuditLogs(page?: string, limit?: string, action?: string): Promise<{
        message: string;
        data: {
            items: never[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
}
export {};
