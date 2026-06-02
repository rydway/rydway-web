import { PrismaService } from '../prisma/prisma.service';
export type NotificationType = 'booking_request' | 'booking_approved' | 'booking_cancelled' | 'payment_received' | 'payout_completed' | 'review_received' | 'kyc_approved' | 'kyc_rejected' | 'vehicle_verified' | 'general';
export interface CreateNotificationPayload {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    entityId?: string;
    entityType?: string;
}
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(payload: CreateNotificationPayload): Promise<{
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
    }>;
    getMyNotifications(userId: string, page?: number, limit?: number): Promise<{
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
    }>;
    markAsRead(userId: string, notificationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    deleteNotification(userId: string, notificationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
