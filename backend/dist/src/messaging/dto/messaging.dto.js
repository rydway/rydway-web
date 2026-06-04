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
exports.CreateConversationDto = exports.SendMessageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendMessageDto {
    conversationId;
    body;
    attachmentUrl;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-conversation-id' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hi, is the car available from June 1st?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'https://storage.supabase.co/attachments/file.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "attachmentUrl", void 0);
class CreateConversationDto {
    bookingId;
    vehicleId;
    hostUserId;
    initialMessage;
}
exports.CreateConversationDto = CreateConversationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-booking-id', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-vehicle-id' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-host-user-id' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "hostUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Is the car available next weekend?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "initialMessage", void 0);
//# sourceMappingURL=messaging.dto.js.map