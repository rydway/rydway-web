import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
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
    } | null>;
    findById(id: string): Promise<{
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
    }>;
    createUser(data: Prisma.UserCreateInput): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
    }>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<{
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
    }>;
    updatePassword(id: string, passwordHash: string): Promise<{
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
    softDelete(id: string): Promise<{
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
    getVendors(page?: number, limit?: number): Promise<{
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
    }>;
}
