import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, UpdateVehicleStatusDto, AddVehicleMediaDto } from './dto/vehicles.dto';
import { AddMaintenanceLogDto } from './dto/maintenance.dto';
export declare class HostVehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    getMyVehicles(user: any): Promise<{
        message: string;
        data: ({
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
    }>;
    createVehicle(user: any, dto: CreateVehicleDto): Promise<{
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
    getVehicleById(user: any, id: string): Promise<{
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
                avgRating: number;
                totalReviews: number;
                subscriptionTier: import("@prisma/client").$Enums.SubscriptionTier;
                subscriptionExpiresAt: Date | null;
                userId: string;
            };
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
        };
    }>;
    updateVehicle(user: any, id: string, dto: UpdateVehicleDto): Promise<{
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
    updateVehicleStatus(user: any, id: string, dto: UpdateVehicleStatusDto): Promise<{
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
    deleteVehicle(user: any, id: string): Promise<{
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
    addVehicleMedia(user: any, id: string, dto: AddVehicleMediaDto): Promise<{
        message: string;
        data: {
            url: string;
            id: string;
            createdAt: Date;
            position: number;
            isPrimary: boolean;
            vehicleId: string;
        };
    }>;
    removeVehicleMedia(user: any, id: string, mediaId: string): Promise<{
        message: string;
        data: boolean;
    }>;
    addMaintenanceLog(user: any, id: string, dto: AddMaintenanceLogDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            description: string | null;
            vehicleId: string;
            title: string;
            maintenanceDate: Date;
            cost: number | null;
            createdBy: string | null;
        };
    }>;
}
