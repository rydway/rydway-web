import { PrismaService } from '../prisma/prisma.service';
export declare class UpdateProfileSettingsDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImageUrl?: string;
}
export declare class UpdateNotificationSettingsDto {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
}
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        profileImageUrl: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        emailVerifiedAt: Date | null;
        createdAt: Date;
    } | null>;
    updateProfile(userId: string, dto: UpdateProfileSettingsDto): Promise<{
        id: string;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        profileImageUrl: string | null;
        updatedAt: Date;
    }>;
    getNotificationSettings(userId: string): Promise<{
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        marketingEmails: boolean;
    }>;
    updateNotificationSettings(userId: string, dto: UpdateNotificationSettingsDto): Promise<{
        updatedAt: Date;
        emailNotifications?: boolean;
        smsNotifications?: boolean;
        pushNotifications?: boolean;
        marketingEmails?: boolean;
        userId: string;
    }>;
    updateSecuritySettings(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
