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
exports.CreateRenterReviewDto = exports.CreateHostReviewDto = exports.CreateVehicleReviewDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVehicleReviewDto {
    bookingId;
    rating;
    body;
}
exports.CreateVehicleReviewDto = CreateVehicleReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-booking-id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleReviewDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateVehicleReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Great car, very clean and well maintained.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVehicleReviewDto.prototype, "body", void 0);
class CreateHostReviewDto {
    bookingId;
    hostRating;
    hostComment;
}
exports.CreateHostReviewDto = CreateHostReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-booking-id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHostReviewDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateHostReviewDto.prototype, "hostRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Very responsive and helpful host.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHostReviewDto.prototype, "hostComment", void 0);
class CreateRenterReviewDto {
    bookingId;
    renterRating;
    renterComment;
}
exports.CreateRenterReviewDto = CreateRenterReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-booking-id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRenterReviewDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRenterReviewDto.prototype, "renterRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Excellent renter, returned the car in perfect condition.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRenterReviewDto.prototype, "renterComment", void 0);
//# sourceMappingURL=reviews.dto.js.map