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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const uploads_service_1 = require("./uploads.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class DeleteFileDto {
    bucket;
    filePath;
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'vehicle-images' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteFileDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'vehicle-photos/car-front.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteFileDto.prototype, "filePath", void 0);
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async getSignedUrl(dto) {
        const data = await this.uploadsService.getSignedUploadUrl(dto);
        return { message: 'Signed URL generated successfully', data };
    }
    async deleteFile(dto) {
        await this.uploadsService.deleteFile(dto.bucket, dto.filePath);
        return { message: 'File deleted successfully', data: null };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('sign-url'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a signed upload URL from Supabase Storage',
        description: 'Returns a signed URL the client uses to upload directly to Supabase Storage. Never exposes storage credentials.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uploads_service_1.GetSignedUrlDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "getSignedUrl", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a file from Supabase Storage' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteFileDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "deleteFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('Uploads'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map