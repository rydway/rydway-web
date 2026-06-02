import { VehiclesService } from './vehicles.service';
export declare class AdminVehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    verifyVehicle(admin: any, id: string): Promise<{
        message: string;
        data: {
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
    rejectVehicle(admin: any, id: string): Promise<{
        message: string;
        data: {
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
}
