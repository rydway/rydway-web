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
exports.AddVehicleMediaDto = exports.UpdateVehicleStatusDto = exports.UpdateVehicleDto = exports.CreateVehicleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateVehicleDto {
    name;
    category;
    fuelType;
    transmission;
    seats;
    dailyRate;
    securityDeposit;
    location;
    latitude;
    longitude;
    description;
    requiresDriver;
    minimumRentalDays;
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Toyota Camry 2022' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sedan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'petrol' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "fuelType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'automatic' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "transmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "seats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "dailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "securityDeposit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Abuja, FCT' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9.0765, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.3986, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Well maintained luxury sedan.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVehicleDto.prototype, "requiresDriver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "minimumRentalDays", void 0);
class UpdateVehicleDto extends (0, swagger_1.PartialType)(CreateVehicleDto) {
}
exports.UpdateVehicleDto = UpdateVehicleDto;
class UpdateVehicleStatusDto {
    status;
}
exports.UpdateVehicleStatusDto = UpdateVehicleStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.VehicleStatus }),
    (0, class_validator_1.IsEnum)(client_1.VehicleStatus),
    __metadata("design:type", String)
], UpdateVehicleStatusDto.prototype, "status", void 0);
class AddVehicleMediaDto {
    url;
    position;
    isPrimary;
}
exports.AddVehicleMediaDto = AddVehicleMediaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.supabase.co/xyz/car-front.jpg' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddVehicleMediaDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddVehicleMediaDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddVehicleMediaDto.prototype, "isPrimary", void 0);
//# sourceMappingURL=vehicles.dto.js.map