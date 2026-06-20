import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    getPublicVehicles(): Promise<{
        message: string;
        data: ({
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
    }>;
    getVehicleById(id: string): Promise<{
        message: string;
        data: {
            host: {
                user: {
                    firstName: string;
                    lastName: string;
                    kycStatus: import("@prisma/client").$Enums.KycStatus;
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
        };
    }>;
    getCalendar(id: string, startDate?: string, endDate?: string): Promise<{
        type: string;
        id: string;
        startDate: Date;
        endDate: Date;
    }[]>;
    addCalendarBlock(id: string, data: {
        startDate: string;
        endDate: string;
        reason?: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        vehicleId: string;
        reason: string | null;
    }>;
    removeCalendarBlock(id: string, blockId: string, req: any): Promise<{
        success: boolean;
    }>;
}
