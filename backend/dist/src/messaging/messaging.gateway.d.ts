import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { SendMessageDto } from './dto/messaging.dto';
import { JwtService } from '@nestjs/jwt';
export declare class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messagingService;
    private jwtService;
    server: Server;
    private connectedUsers;
    constructor(messagingService: MessagingService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(data: {
        conversationId: string;
    }, client: Socket): {
        event: string;
        data: string;
    };
    handleLeaveConversation(data: {
        conversationId: string;
    }, client: Socket): {
        event: string;
        data: string;
    };
    handleSendMessage(dto: SendMessageDto, client: Socket): Promise<{
        event: string;
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
    } | undefined>;
    handleMarkRead(data: {
        conversationId: string;
    }, client: Socket): Promise<void>;
    pushToUser(userId: string, event: string, payload: any): void;
}
