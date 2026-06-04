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
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messaging_service_1 = require("./messaging.service");
const messaging_dto_1 = require("./dto/messaging.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const policy_guard_1 = require("../common/guards/policy.guard");
const policies_decorator_1 = require("../common/policies/policies.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let MessagingController = class MessagingController {
    messagingService;
    constructor(messagingService) {
        this.messagingService = messagingService;
    }
    async createConversation(user, dto) {
        const data = await this.messagingService.createConversation(user.id, dto);
        return {
            message: 'Conversation ready',
            data,
        };
    }
    async getConversations(user) {
        const data = await this.messagingService.getConversations(user.id);
        return {
            message: 'Conversations fetched successfully',
            data,
        };
    }
    async getMessages(user, id, page = '1', limit = '30') {
        const data = await this.messagingService.getMessages(user.id, id, parseInt(page), parseInt(limit));
        return {
            message: 'Messages fetched successfully',
            data,
        };
    }
    async sendMessage(user, dto) {
        const data = await this.messagingService.sendMessage(user.id, dto);
        return {
            message: 'Message sent successfully',
            data,
        };
    }
    async markAsRead(user, id) {
        await this.messagingService.markAsRead(user.id, id);
        return {
            message: 'Messages marked as read',
            data: null,
        };
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new conversation or resume existing one' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, messaging_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all conversations for current user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages in a conversation' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message via REST (fallback for WebSocket)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, messaging_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all messages in a conversation as read' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markAsRead", null);
exports.MessagingController = MessagingController = __decorate([
    (0, swagger_1.ApiTags)('Messaging'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, policy_guard_1.PolicyGuard),
    (0, policies_decorator_1.RequireActiveStatus)(),
    (0, common_1.Controller)('conversations'),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map