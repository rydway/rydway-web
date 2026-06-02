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
exports.ReviewKycDto = exports.SubmitHostKycDto = exports.SubmitRenterKycDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SubmitRenterKycDto {
    licenseNumber;
    licenseExpiry;
    licenseDocumentUrl;
    selfieUrl;
}
exports.SubmitRenterKycDto = SubmitRenterKycDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC1234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2030-01-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/xyz/license.pdf' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "licenseDocumentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/xyz/selfie.jpg' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "selfieUrl", void 0);
class SubmitHostKycDto {
    businessName;
    cacNumber;
    taxId;
    cacDocumentUrl;
    bankName;
    accountName;
    accountNumber;
}
exports.SubmitHostKycDto = SubmitHostKycDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rydway Rentals Ltd' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RC123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "cacNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345678-0001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/xyz/cac.pdf' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "cacDocumentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GTBank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rydway Rentals Ltd' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "accountName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "accountNumber", void 0);
class ReviewKycDto {
    reviewNotes;
}
exports.ReviewKycDto = ReviewKycDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'All documents valid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReviewKycDto.prototype, "reviewNotes", void 0);
//# sourceMappingURL=kyc.dto.js.map