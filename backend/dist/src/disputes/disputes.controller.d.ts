import { DisputesService } from './disputes.service';
import { RaiseDisputeDto, ResolveDisputeDto } from './dto/disputes.dto';
import { DisputeStatus } from '@prisma/client';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    raiseDispute(user: any, dto: RaiseDisputeDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            raisedBy: string;
            resolution: string | null;
            resolvedAt: Date | null;
        };
    }>;
    getMyDisputes(user: any): Promise<{
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
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            raisedBy: string;
            resolution: string | null;
            resolvedAt: Date | null;
        })[];
    }>;
    getAllDisputes(status?: DisputeStatus): Promise<{
        message: string;
        data: ({
            booking: {
                hostProfile: {
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
                renter: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                vehicle: {
                    name: string;
                };
                inspections: {
                    id: string;
                    createdAt: Date;
                    type: import("@prisma/client").$Enums.InspectionType;
                    bookingId: string;
                    photoUrls: string[];
                }[];
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            raisedBy: string;
            resolution: string | null;
            resolvedAt: Date | null;
        })[];
    }>;
    getDisputeById(id: string): Promise<{
        message: string;
        data: {
            booking: {
                hostProfile: {
                    user: {
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
                renter: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                vehicle: {
                    name: string;
                    images: {
                        id: string;
                        createdAt: Date;
                        url: string;
                        position: number;
                        isPrimary: boolean;
                        vehicleId: string;
                    }[];
                };
                inspections: {
                    id: string;
                    createdAt: Date;
                    type: import("@prisma/client").$Enums.InspectionType;
                    bookingId: string;
                    photoUrls: string[];
                }[];
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            raisedBy: string;
            resolution: string | null;
            resolvedAt: Date | null;
        };
    }>;
    resolveDispute(admin: any, id: string, dto: ResolveDisputeDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.DisputeStatus;
            bookingId: string;
            reason: string;
            raisedBy: string;
            resolution: string | null;
            resolvedAt: Date | null;
        };
    }>;
}
