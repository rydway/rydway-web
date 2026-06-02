import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto/messaging.dto';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  private filterMessageContent(text: string): string {
    if (!text) return text;
    let filtered = text.replace(/(\+?234|0)[789][01]\d{8}/g, '[REDACTED]');
    filtered = filtered.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED]');
    filtered = filtered.replace(/(whatsapp|call me|dm me|instagram|twitter|phone number|pay cash)/gi, '[REDACTED]');
    return filtered;
  }

  async createConversation(renterId: string, dto: CreateConversationDto) {
    // Check if conversation already exists between these two parties for this vehicle/booking
    const existing = await this.prisma.conversation.findFirst({
      where: {
        renterId,
        hostUserId: dto.hostUserId,
        vehicleId: dto.vehicleId,
        ...(dto.bookingId ? { bookingId: dto.bookingId } : {}),
      },
    });

    if (existing) {
      // Return existing conversation + send the new initial message
      const message = await this.prisma.message.create({
        data: {
          conversationId: existing.id,
          senderId: renterId,
          body: this.filterMessageContent(dto.initialMessage),
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
            body: this.filterMessageContent(dto.initialMessage),
          },
        },
      },
      include: { messages: true },
    });

    return { conversation, message: conversation.messages[0] };
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.renterId === userId || conversation.hostUserId === userId;
    if (!isParticipant) throw new ForbiddenException('You are not part of this conversation');

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: userId,
        body: this.filterMessageContent(dto.body),
        attachmentUrl: dto.attachmentUrl,
      },
    });

    // Update conversation updatedAt
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ renterId: userId }, { hostUserId: userId }],
      },
      include: {
        vehicle: { select: { name: true, id: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Last message preview
        },
        renter: { select: { firstName: true, lastName: true } },
        host: { select: { firstName: true, lastName: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 30) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.renterId === userId || conversation.hostUserId === userId;
    if (!isParticipant) throw new ForbiddenException('You are not part of this conversation');

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
      messages: messages.reverse(), // Oldest first
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.renterId === userId || conversation.hostUserId === userId;
    if (!isParticipant) throw new ForbiddenException('Not your conversation');

    // Mark all unread messages not sent by current user as read
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
}
