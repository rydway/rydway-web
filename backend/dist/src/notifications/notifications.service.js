"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("./mail.service");
let NotificationsService = class NotificationsService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async create(payload) {
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
        this.prisma.user.findUnique({
            where: { id: payload.userId },
            select: { email: true, firstName: true }
        }).then(async (user) => {
            if (user?.email) {
                await this.mailService.sendNotificationEmail(user.email, user.firstName, payload.title, payload.message);
            }
        }).catch(err => {
            console.error('Failed to trigger notification email delivery', err);
        });
        return notification;
    }
    async getMyNotifications(userId, page = 1, limit = 20) {
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
    async markAsRead(userId, notificationId) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({ where: { userId, isRead: false } });
    }
    async deleteNotification(userId, notificationId) {
        return this.prisma.notification.deleteMany({
            where: { id: notificationId, userId },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map