import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';
import { SendMessageDto, CreateConversationDto } from './dto/messaging.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/messaging',
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private messagingService: MessagingService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      this.connectedUsers.set(client.id, payload.sub);
      client.join(`user:${payload.sub}`); // Join personal room
      client.emit('connected', { userId: payload.sub });
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
    client.join(`conversation:${data.conversationId}`);
    return { event: 'joinedConversation', data: data.conversationId };
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
    client.leave(`conversation:${data.conversationId}`);
    return { event: 'leftConversation', data: data.conversationId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() dto: SendMessageDto, @ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      const message = await this.messagingService.sendMessage(userId, dto);

      // Broadcast to all in the conversation room
      this.server.to(`conversation:${dto.conversationId}`).emit('newMessage', message);

      return { event: 'messageSent', data: message };
    } catch (err) {
      client.emit('error', { message: err.message });
    }
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    await this.messagingService.markAsRead(userId, data.conversationId);

    // Notify the conversation that messages were read by this user
    this.server.to(`conversation:${data.conversationId}`).emit('messagesRead', {
      conversationId: data.conversationId,
      byUserId: userId,
    });
  }

  // Utility method to push real-time events from services (e.g., booking approved notification)
  pushToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
