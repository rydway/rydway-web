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
exports.UploadsService = exports.GetSignedUrlDto = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
class GetSignedUrlDto {
    bucket;
    filePath;
    mimeType;
    fileSizeBytes;
}
exports.GetSignedUrlDto = GetSignedUrlDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'vehicle-images' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetSignedUrlDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'vehicle-photos/car-front.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetSignedUrlDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetSignedUrlDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 1048576 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetSignedUrlDto.prototype, "fileSizeBytes", void 0);
let UploadsService = class UploadsService {
    supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    async getSignedUploadUrl(dto) {
        if (!ALLOWED_MIME_TYPES.includes(dto.mimeType)) {
            throw new common_1.BadRequestException(`File type not allowed: ${dto.mimeType}`);
        }
        if (dto.fileSizeBytes && dto.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
            throw new common_1.BadRequestException('File exceeds maximum allowed size of 10MB');
        }
        const { data, error } = await this.supabase.storage
            .from(dto.bucket)
            .createSignedUploadUrl(dto.filePath);
        if (error)
            throw new common_1.BadRequestException(`Could not generate signed URL: ${error.message}`);
        return {
            signedUrl: data.signedUrl,
            token: data.token,
            path: data.path,
            fullPath: `${process.env.SUPABASE_URL}/storage/v1/object/public/${dto.bucket}/${dto.filePath}`,
        };
    }
    async deleteFile(bucket, filePath) {
        const { error } = await this.supabase.storage.from(bucket).remove([filePath]);
        if (error)
            throw new common_1.BadRequestException(`Could not delete file: ${error.message}`);
        return true;
    }
    getPublicUrl(bucket, filePath) {
        const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)()
], UploadsService);
//# sourceMappingURL=uploads.service.js.map