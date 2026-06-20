import { PrismaService } from '../prisma/prisma.service';
import { RaiseDisputeDto, ResolveDisputeDto } from './dto/disputes.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { DisputeStatus } from '@prisma/client';
export declare class DisputesService {
    private prisma;
    private auditLogService;
    constructor(prisma: PrismaService, auditLogService: AuditLogService);
    raiseDispute(userId: string, dto: RaiseDisputeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        raisedBy: string;
        resolution: string | null;
        resolvedAt: Date | null;
    }>;
    resolveDispute(adminId: string, disputeId: string, dto: ResolveDisputeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        raisedBy: string;
        resolution: string | null;
        resolvedAt: Date | null;
    }>;
    getAllDisputes(status?: DisputeStatus): Promise<({
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
    })[]>;
    getMyDisputes(userId: string): Promise<({
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
    })[]>;
    getDisputeById(id: string): Promise<{
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
    }>;
}
