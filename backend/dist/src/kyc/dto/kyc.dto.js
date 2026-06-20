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
    dateOfBirth;
    state;
    city;
    address;
    emergencyContactName;
    emergencyContactPhone;
    drivingChoice;
    identificationType;
    identificationDocumentUrl;
    preferredCarType;
    primaryRentalPurpose;
    usageFrequency;
    typicalTripType;
    vehiclePreference;
}
exports.SubmitRenterKycDto = SubmitRenterKycDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ABC1234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2030-01-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://storage.supabase.co/xyz/license.pdf' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "licenseDocumentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/xyz/selfie.jpg' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "selfieUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2000-01-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lagos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ikeja' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 Street Name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+2348000000000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'yes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "drivingChoice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'nin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "identificationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://storage.supabase.co/xyz/id.jpg' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "identificationDocumentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'luxury' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "preferredCarType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'business' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "primaryRentalPurpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'frequent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "usageFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'short' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "typicalTripType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'suv' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitRenterKycDto.prototype, "vehiclePreference", void 0);
class SubmitHostKycDto {
    businessName;
    cacNumber;
    taxId;
    cacDocumentUrl;
    bankName;
    accountName;
    accountNumber;
    legalBusinessName;
    tradingName;
    businessType;
    rcNumber;
    dateOfIncorporation;
    businessState;
    businessCity;
    businessAddress;
    businessPhone;
    businessEmail;
    tin;
    vatStatus;
    frscFleetStatus;
    stateTransportPermit;
    ownerName;
    ownerPhone;
    ownerNIN;
    ownerDOB;
    ownerEmail;
    ownershipPercentage;
    cacCertificate;
    cacStatusReport;
    utilityBill;
    taxClearanceCertificate;
}
exports.SubmitHostKycDto = SubmitHostKycDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rydway Rentals Ltd' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'RC123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "cacNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12345678-0001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://storage.supabase.co/xyz/cac.pdf' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "cacDocumentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'GTBank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rydway Rentals Ltd' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "accountName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '0123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dembo Autos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "legalBusinessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dembo Autos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "tradingName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: [
            'sole_proprietorship',
            'partnership',
            'limited_liability',
            'corporation',
        ],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'RC234445' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "rcNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06-10' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "dateOfIncorporation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lagos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ikeja' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'T20 street C Phase1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+2349020722091' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'business@company.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "businessEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'TIN123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "tin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['pending', 'registered', 'exempt'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "vatStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['yes', 'no', 'pending'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "frscFleetStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['yes', 'no', 'pending'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "stateTransportPermit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Agbo Terry Terwase' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "ownerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+2349020722091' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "ownerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '44556789043' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "ownerNIN", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2002-02-22' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "ownerDOB", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'owner@email.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "ownerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 80 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SubmitHostKycDto.prototype, "ownershipPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://storage.supabase.co/xyz/cac_certificate.pdf',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "cacCertificate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://storage.supabase.co/xyz/cac_status_report.pdf',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "cacStatusReport", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://storage.supabase.co/xyz/utility_bill.pdf',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "utilityBill", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://storage.supabase.co/xyz/tax_clearance.pdf',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitHostKycDto.prototype, "taxClearanceCertificate", void 0);
class ReviewKycDto {
    reviewNotes;
}
exports.ReviewKycDto = ReviewKycDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'All documents valid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReviewKycDto.prototype, "reviewNotes", void 0);
//# sourceMappingURL=kyc.dto.js.map