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
exports.SearchVehiclesDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class SearchVehiclesDto {
    location;
    latitude;
    longitude;
    radius;
    startDate;
    endDate;
    category;
    priceMin;
    priceMax;
    seats;
    transmission;
    fuelType;
    verifiedOnly;
    featuredOnly;
    page = 1;
    limit = 20;
}
exports.SearchVehiclesDto = SearchVehiclesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Abuja' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchVehiclesDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Radius in km' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2026-06-01T00:00:00Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SearchVehiclesDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2026-06-05T00:00:00Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SearchVehiclesDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'suv' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchVehiclesDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "seats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchVehiclesDto.prototype, "transmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchVehiclesDto.prototype, "fuelType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchVehiclesDto.prototype, "verifiedOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchVehiclesDto.prototype, "featuredOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchVehiclesDto.prototype, "limit", void 0);
//# sourceMappingURL=search.dto.js.map