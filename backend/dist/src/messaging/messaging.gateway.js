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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messaging_service_1 = require("./messaging.service");
const messaging_dto_1 = require("./dto/messaging.dto");
const jwt_1 = require("@nestjs/jwt");
let MessagingGateway = class MessagingGateway {
    messagingService;
    jwtService;
    server;
    connectedUsers = new Map();
    constructor(messagingService, jwtService) {
        this.messagingService = messagingService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            this.connectedUsers.set(client.id, payload.sub);
            client.join(`user:${payload.sub}`);
            client.emit('connected', { userId: payload.sub });
        }
        catch (e) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
    }
    handleJoinConversation(data, client) {
        client.join(`conversation:${data.conversationId}`);
        return { event: 'joinedConversation', data: data.conversationId };
    }
    handleLeaveConversation(data, client) {
        client.leave(`conversation:${data.conversationId}`);
        return { event: 'leftConversation', data: data.conversationId };
    }
    async handleSendMessage(dto, client) {
        const userId = this.connectedUsers.get(client.id);
        if (!userId) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        try {
            const message = await this.messagingService.sendMessage(userId, dto);
            this.server.to(`conversation:${dto.conversationId}`).emit('newMessage', message);
            return { event: 'messageSent', data: message };
        }
        catch (err) {
            client.emit('error', { message: err.message });
        }
    }
    async handleMarkRead(data, client) {
        const userId = this.connectedUsers.get(client.id);
        if (!userId)
            return;
        await this.messagingService.markAsRead(userId, data.conversationId);
        this.server.to(`conversation:${data.conversationId}`).emit('messagesRead', {
            conversationId: data.conversationId,
            byUserId: userId,
        });
    }
    pushToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
};
exports.MessagingGateway = MessagingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagingGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagingGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [messaging_dto_1.SendMessageDto, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markRead'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagingGateway.prototype, "handleMarkRead", null);
exports.MessagingGateway = MessagingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/messaging',
    }),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService,
        jwt_1.JwtService])
], MessagingGateway);
//# sourceMappingURL=messaging.gateway.js.map