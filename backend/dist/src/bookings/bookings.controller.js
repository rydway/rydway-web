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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const bookings_dto_1 = require("./dto/bookings.dto");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
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
    async approveBooking(user, id) {
        const data = await this.bookingsService.approveBooking(user.id, id);
        return {
            message: 'Booking approved successfully',
            data,
        };
    }
    async declineBooking(user, id) {
        const data = await this.bookingsService.declineBooking(user.id, id);
        return {
            message: 'Booking declined successfully',
            data,
        };
    }
    async markActive(user, id) {
        const data = await this.bookingsService.markActive(user.id, id);
        return {
            message: 'Booking marked as active',
            data,
        };
    }
    async completeBooking(user, id) {
        const data = await this.bookingsService.completeBooking(user.id, id);
        return {
            message: 'Booking marked as completed',
            data,
        };
    }
    async disputeBooking(user, id) {
        const data = await this.bookingsService.disputeBooking(user.id, id);
        return {
            message: 'Booking disputed successfully',
            data,
        };
    }
    async refundBooking(user, id) {
        const data = await this.bookingsService.refundBooking(user.id, id);
        return {
            message: 'Booking refunded successfully',
            data,
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.renter),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bookings_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking details (participants only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "approveBooking", null);
__decorate([
    (0, common_1.Patch)(':id/decline'),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Decline a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "declineBooking", null);
__decorate([
    (0, common_1.Post)(':id/mark-active'),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Mark booking as active (trip started)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "markActive", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Mark booking as completed (trip ended)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "completeBooking", null);
__decorate([
    (0, common_1.Post)(':id/dispute'),
    (0, roles_decorator_1.Roles)(client_1.Role.renter, client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Dispute a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "disputeBooking", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Refund a booking (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "refundBooking", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map