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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reviews_service_1 = require("./reviews.service");
const reviews_dto_1 = require("./dto/reviews.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async reviewVehicle(user, dto) {
        const data = await this.reviewsService.createVehicleReview(user.id, dto);
        return { message: 'Vehicle reviewed successfully', data };
    }
    async reviewHost(user, dto) {
        const data = await this.reviewsService.createHostReview(user.id, dto);
        return { message: 'Host reviewed successfully', data };
    }
    async reviewRenter(user, dto) {
        const data = await this.reviewsService.createRenterReview(user.id, dto);
        return { message: 'Renter reviewed successfully', data };
    }
    async getMyReviews(user, page = '1', limit = '10') {
        const data = await this.reviewsService.getMyReceivedReviews(user.id, parseInt(page), parseInt(limit));
        return { message: 'Reviews fetched successfully', data };
    }
    async getVehicleReviews(vehicleId, page = '1', limit = '10') {
        const data = await this.reviewsService.getVehicleReviews(vehicleId, parseInt(page), parseInt(limit));
        return { message: 'Vehicle reviews fetched successfully', data };
    }
    async getHostReviews(hostUserId, page = '1', limit = '10') {
        const data = await this.reviewsService.getHostReviews(hostUserId, parseInt(page), parseInt(limit));
        return { message: 'Host reviews fetched successfully', data };
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)('vehicle'),
    (0, roles_decorator_1.Roles)(client_1.Role.renter),
    (0, swagger_1.ApiOperation)({ summary: 'Renter reviews a vehicle after a completed booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reviews_dto_1.CreateVehicleReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "reviewVehicle", null);
__decorate([
    (0, common_1.Post)('host'),
    (0, roles_decorator_1.Roles)(client_1.Role.renter),
    (0, swagger_1.ApiOperation)({ summary: 'Renter reviews a host after a completed booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reviews_dto_1.CreateHostReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "reviewHost", null);
__decorate([
    (0, common_1.Post)('renter'),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Host reviews a renter after a completed booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reviews_dto_1.CreateRenterReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "reviewRenter", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews received by the current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getMyReviews", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('vehicles/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews for a vehicle (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Param)('vehicleId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getVehicleReviews", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('hosts/:hostUserId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews for a host (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Param)('hostUserId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getHostReviews", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map