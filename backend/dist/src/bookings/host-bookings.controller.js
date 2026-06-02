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
exports.HostBookingsController = void 0;
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
let HostBookingsController = class HostBookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async getHostBookings(user) {
        const data = await this.bookingsService.getHostBookings(user.id);
        return {
            message: 'Bookings fetched successfully',
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
    async cancelBooking(user, id) {
        const data = await this.bookingsService.cancelBooking(user.id, id, user.role);
        return {
            message: 'Booking cancelled successfully',
            data,
        };
    }
};
exports.HostBookingsController = HostBookingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all host bookings' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostBookingsController.prototype, "getHostBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get host booking details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostBookingsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostBookingsController.prototype, "approveBooking", null);
__decorate([
    (0, common_1.Patch)(':id/decline'),
    (0, swagger_1.ApiOperation)({ summary: 'Decline a booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostBookingsController.prototype, "declineBooking", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking as host' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostBookingsController.prototype, "cancelBooking", null);
exports.HostBookingsController = HostBookingsController = __decorate([
    (0, swagger_1.ApiTags)('Host Fleet'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, policy_guard_1.PolicyGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, policies_decorator_1.RequireActiveStatus)(),
    (0, common_1.Controller)('host/bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], HostBookingsController);
//# sourceMappingURL=host-bookings.controller.js.map