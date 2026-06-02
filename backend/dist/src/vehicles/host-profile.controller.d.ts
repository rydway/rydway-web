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
                    url: string;
                    id: string;
                    createdAt: Date;
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
            avgRating: number;
            totalReviews: number;
            subscriptionTier: import("@prisma/client").$Enums.SubscriptionTier;
            subscriptionExpiresAt: Date | null;
            userId: string;
        };
    }>;
}
