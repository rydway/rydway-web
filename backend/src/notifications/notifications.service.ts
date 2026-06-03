import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';

export type NotificationType =
  | 'booking_request'
  | 'booking_approved'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payout_completed'
  | 'review_received'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'vehicle_verified'
  | 'general';

export interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  entityId?: string;
  entityType?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(payload: CreateNotificationPayload) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        actionUrl: payload.actionUrl,
        entityId: payload.entityId,
        entityType: payload.entityType,
        isRead: false,
      },
    });

    // Proactively send email notification asynchronously
    this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { email: true, firstName: true }
    }).then(async (user) => {
      if (user?.email) {
        await this.mailService.sendNotificationEmail(
          user.email,
          user.firstName,
          payload.title,
          payload.message
        );
      }
    }).catch(err => {
      console.error('Failed to trigger notification email delivery', err);
    });

    return notification;
  }

  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      unreadCount,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async deleteNotification(userId: string, notificationId: string) {
    return this.prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }
}
