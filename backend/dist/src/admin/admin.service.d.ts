import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class AdminService {
    private prisma;
    private redisService;
    private auditLogService;
    constructor(prisma: PrismaService, redisService: RedisService, auditLogService: AuditLogService);
    getDashboardSummary(): Promise<any>;
    getUsers(page?: number, limit?: number, role?: string, search?: string): Promise<{
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
    }>;
    getUserById(id: string): Promise<({
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
    }) | null>;
    updateUserStatus(adminId: string, userId: string, isActive: boolean): Promise<{
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
    }>;
    getAllKycSubmissions(page?: number, limit?: number, status?: string): Promise<{
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
    }>;
    getAllVehicles(page?: number, limit?: number, verified?: boolean): Promise<{
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
    }>;
    getAllBookings(page?: number, limit?: number, status?: string): Promise<{
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
    }>;
    getAllPayments(page?: number, limit?: number): Promise<{
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
            transactionRef: string;
            provider: string;
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
    }>;
    getAllPayouts(page?: number, limit?: number, status?: string): Promise<{
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAuditLogs(page?: number, limit?: number, action?: string): Promise<{
        items: never[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
