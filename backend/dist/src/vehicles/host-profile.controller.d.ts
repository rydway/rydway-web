import { VehiclesService } from './vehicles.service';
export declare class HostProfileController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    getHostStorefront(hostId: string): Promise<{
        message: string;
        data: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string | null;
                createdAt: Date;
            };
            vehicles: ({
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
    }>;
}
