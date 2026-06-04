import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from './dto/messaging.dto';
export declare class MessagingService {
    private prisma;
    constructor(prisma: PrismaService);
    private filterMessageContent;
    createConversation(renterId: string, dto: CreateConversationDto): Promise<{
        conversation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            renterId: string;
            vehicleId: string;
            bookingId: string | null;
            hostUserId: string;
        };
        message: {
            id: string;
            createdAt: Date;
            body: string;
            isRead: boolean;
            readAt: Date | null;
            attachmentUrl: string | null;
            conversationId: string;
            senderId: string;
        };
    }>;
    sendMessage(userId: string, dto: SendMessageDto): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        isRead: boolean;
        readAt: Date | null;
        attachmentUrl: string | null;
        conversationId: string;
        senderId: string;
    }>;
    getConversations(userId: string): Promise<({
        renter: {
            firstName: string;
            lastName: string;
        };
        host: {
            firstName: string;
            lastName: string;
        };
        vehicle: {
            id: string;
            name: string;
        };
        messages: {
            id: string;
            createdAt: Date;
            body: string;
            isRead: boolean;
            readAt: Date | null;
            attachmentUrl: string | null;
            conversationId: string;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
        vehicleId: string;
        bookingId: string | null;
        hostUserId: string;
    })[]>;
    getMessages(userId: string, conversationId: string, page?: number, limit?: number): Promise<{
        messages: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            body: string;
            isRead: boolean;
            readAt: Date | null;
            attachmentUrl: string | null;
            conversationId: string;
            senderId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markAsRead(userId: string, conversationId: string): Promise<boolean>;
}
