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
exports.RenterBookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const policy_guard_1 = require("../common/guards/policy.guard");
const policies_decorator_1 = require("../common/policies/policies.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const bookings_dto_1 = require("./dto/bookings.dto");
let RenterBookingsController = class RenterBookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async getRenterBookings(user) {
        const data = await this.bookingsService.getRenterBookings(user.id);
        return {
            message: 'Bookings fetched successfully',
            data,
        };
    }
    async createBooking(user, dto) {
        const data = await this.bookingsService.createBooking(user.id, dto);
        return {
            message: 'Booking created successfully',
            data,
        };
    }
    async getBookingById(user, id) {
        const data = await this.bookingsService.getBookingById(user.id, id, user.role);
        return {
            message: 'Booking fetched successfully',
            data,
        };
    }
    async cancelBooking(user, id) {
        const data = await this.bookingsService.cancelBooking(user.id, id, user.role);
        return {
            message: 'Booking cancelled successfully',
            data,
        };
    }
    async extendBooking(user, id, dto) {
        const data = await this.bookingsService.extendBooking(user.id, id, dto);
        return {
            message: 'Booking extended successfully',
            data,
        };
    }
};
exports.RenterBookingsController = RenterBookingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all renter bookings' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RenterBookingsController.prototype, "getRenterBookings", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bookings_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], RenterBookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get renter booking details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RenterBookingsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RenterBookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Post)(':id/extend'),
    (0, swagger_1.ApiOperation)({ summary: 'Extend a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, bookings_dto_1.ExtendBookingDto]),
    __metadata("design:returntype", Promise)
], RenterBookingsController.prototype, "extendBooking", null);
exports.RenterBookingsController = RenterBookingsController = __decorate([
    (0, swagger_1.ApiTags)('Renter Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, policy_guard_1.PolicyGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.renter),
    (0, policies_decorator_1.RequireActiveStatus)(),
    (0, common_1.Controller)('renter/bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], RenterBookingsController);
//# sourceMappingURL=renter-bookings.controller.js.map