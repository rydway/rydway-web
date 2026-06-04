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
exports.ExtendBookingDto = exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBookingDto {
    vehicleId;
    startDate;
    endDate;
    pickupTime;
    dropoffTime;
    pickupLocation;
    dropoffLocation;
    extras;
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-05' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pickupTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '18:00:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "dropoffTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Abuja Airport' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Abuja City Center' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "dropoffLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: { insurance: true, driver: false } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateBookingDto.prototype, "extras", void 0);
class ExtendBookingDto {
    newEndDate;
}
exports.ExtendBookingDto = ExtendBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-07' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ExtendBookingDto.prototype, "newEndDate", void 0);
//# sourceMappingURL=bookings.dto.js.map