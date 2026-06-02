import { VehicleStatus } from '@prisma/client';
export declare class CreateVehicleDto {
    name: string;
    category: string;
    fuelType: string;
    transmission: string;
    seats: number;
    dailyRate: number;
    securityDeposit: number;
    location: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    requiresDriver?: boolean;
    minimumRentalDays?: number;
}
declare const UpdateVehicleDto_base: import("@nestjs/common").Type<Partial<CreateVehicleDto>>;
export declare class UpdateVehicleDto extends UpdateVehicleDto_base {
}
export declare class UpdateVehicleStatusDto {
    status: VehicleStatus;
}
export declare class AddVehicleMediaDto {
    url: string;
    position?: number;
    isPrimary?: boolean;
}
export {};
