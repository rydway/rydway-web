import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateProfile(user: any, dto: UpdateUserDto): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updatePassword(user: any, dto: UpdatePasswordDto): Promise<{
        message: string;
        data: null;
    }>;
    softDelete(user: any): Promise<{
        message: string;
        data: null;
    }>;
    getVendors(page?: string, limit?: string): Promise<{
        message: string;
        data: {
            data: {
                id: string;
                email: string;
                phone: string | null;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                profileImageUrl: string | null;
                kycStatus: import("@prisma/client").$Enums.KycStatus;
                hostProfile: {
                    id: string;
                    avgRating: number;
                    totalReviews: number;
                    businessName: string | null;
                    tradingName: string | null;
                    businessAddress: string | null;
                    businessPhone: string | null;
                    businessEmail: string | null;
                } | null;
            }[];
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    getUserById(id: string): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
