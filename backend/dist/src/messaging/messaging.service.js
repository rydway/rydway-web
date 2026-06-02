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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagingService = class MessagingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createConversation(renterId, dto) {
        const existing = await this.prisma.conversation.findFirst({
            where: {
                renterId,
                hostUserId: dto.hostUserId,
                vehicleId: dto.vehicleId,
                ...(dto.bookingId ? { bookingId: dto.bookingId } : {}),
            },
        });
        if (existing) {
            const message = await this.prisma.message.create({
                data: {
                    conversationId: existing.id,
                    senderId: renterId,
                    body: dto.initialMessage,
                },
            });
            return { conversation: existing, message };
        }
        const conversation = await this.prisma.conversation.create({
            data: {
                renterId,
                hostUserId: dto.hostUserId,
                vehicleId: dto.vehicleId,
                bookingId: dto.bookingId,
                messages: {
                    create: {
                        senderId: renterId,
                        body: dto.initialMessage,
                    },
                },
            },
            include: { messages: true },
        });
        return { conversation, message: conversation.messages[0] };
    }
    async sendMessage(userId, dto) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: dto.conversationId },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const isParticipant = conversation.renterId === userId || conversation.hostUserId === userId;
        if (!isParticipant)
            throw new common_1.ForbiddenException('You are not part of this conversation');
        const message = await this.prisma.message.create({
            data: {
                conversationId: dto.conversationId,
                senderId: userId,
                body: dto.body,
                attachmentUrl: dto.attachmentUrl,
            },
        });
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: { updatedAt: new Date() },
        });
        return message;
    }
    async getConversations(userId) {
        return this.prisma.conversation.findMany({
            where: {
                OR: [{ renterId: userId }, { hostUserId: userId }],
            },
            include: {
                vehicle: { select: { name: true, id: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                renter: { select: { firstName: true, lastName: true } },
                host: { select: { firstName: true, lastName: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getMessages(userId, conversationId, page = 1, limit = 30) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const isParticipant = conversation.renterId === userId || conversation.hostUserId === userId;
        if (!isParticipant)
            throw new common_1.ForbiddenException('You are not part of this conversation');
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    sender: { select: { id: true, firstName: true, lastName: true } },
                },
            }),
            this.prisma.message.count({ where: { conversationId } }),
        ]);
        return {
            messages: messages.reverse(),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async markAsRead(userId, conversationId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const isParticipant = conversation.renterId === userId || conversation.hostUserId === userId;
        if (!isParticipant)
            throw new common_1.ForbiddenException('Not your conversation');
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false,
            },
            data: { isRead: true, readAt: new Date() },
        });
        return true;
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map