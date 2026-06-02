import { SettingsService, UpdateProfileSettingsDto, UpdateNotificationSettingsDto } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getProfile(user: any): Promise<{
        message: string;
        data: {
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
        } | null;
    }>;
    updateProfile(user: any, dto: UpdateProfileSettingsDto): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            profileImageUrl: string | null;
            updatedAt: Date;
        };
    }>;
    getNotificationSettings(user: any): Promise<{
        message: string;
        data: {
            emailNotifications: boolean;
            smsNotifications: boolean;
            pushNotifications: boolean;
            marketingEmails: boolean;
        };
    }>;
    updateNotificationSettings(user: any, dto: UpdateNotificationSettingsDto): Promise<{
        message: string;
        data: {
            updatedAt: Date;
            emailNotifications?: boolean;
            smsNotifications?: boolean;
            pushNotifications?: boolean;
            marketingEmails?: boolean;
            userId: string;
        };
    }>;
    updateSecuritySettings(user: any): Promise<{
        message: string;
        data: {
            message: string;
        };
    }>;
}
