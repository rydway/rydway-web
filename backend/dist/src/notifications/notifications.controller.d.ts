import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(user: any, page?: string, limit?: string): Promise<{
        message: string;
        data: {
            notifications: {
                id: string;
                createdAt: Date;
                userId: string;
                type: string;
                message: string;
                title: string;
                isRead: boolean;
                readAt: Date | null;
                actionUrl: string | null;
                entityId: string | null;
                entityType: string | null;
            }[];
            unreadCount: number;
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getUnreadCount(user: any): Promise<{
        message: string;
        data: {
            count: number;
        };
    }>;
    markAsRead(user: any, id: string): Promise<{
        message: string;
        data: null;
    }>;
    markAllAsRead(user: any): Promise<{
        message: string;
        data: null;
    }>;
    deleteNotification(user: any, id: string): Promise<{
        message: string;
        data: null;
    }>;
}
