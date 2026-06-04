import { MessagingService } from './messaging.service';
import { CreateConversationDto, SendMessageDto } from './dto/messaging.dto';
export declare class MessagingController {
    private readonly messagingService;
    constructor(messagingService: MessagingService);
    createConversation(user: any, dto: CreateConversationDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getConversations(user: any): Promise<{
        message: string;
        data: ({
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
        })[];
    }>;
    getMessages(user: any, id: string, page?: string, limit?: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    sendMessage(user: any, dto: SendMessageDto): Promise<{
        message: string;
        data: {
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
    markAsRead(user: any, id: string): Promise<{
        message: string;
        data: null;
    }>;
}
