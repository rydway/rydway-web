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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class UpdateUserStatusDto {
    isActive;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserStatusDto.prototype, "isActive", void 0);
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardSummary() {
        const data = await this.adminService.getDashboardSummary();
        return { message: 'Admin dashboard fetched successfully', data };
    }
    async getUsers(page = '1', limit = '20', role, search) {
        const data = await this.adminService.getUsers(parseInt(page), parseInt(limit), role, search);
        return { message: 'Users fetched successfully', data };
    }
    async getUserById(id) {
        const data = await this.adminService.getUserById(id);
        return { message: 'User fetched successfully', data };
    }
    async updateUserStatus(admin, id, dto) {
        const data = await this.adminService.updateUserStatus(admin.id, id, dto.isActive);
        return { message: `User ${dto.isActive ? 'activated' : 'deactivated'} successfully`, data };
    }
    async getAllKyc(page = '1', limit = '20', status) {
        const data = await this.adminService.getAllKycSubmissions(parseInt(page), parseInt(limit), status);
        return { message: 'KYC submissions fetched successfully', data };
    }
    async getAllVehicles(page = '1', limit = '20', verified) {
        const verifiedBool = verified === 'true' ? true : verified === 'false' ? false : undefined;
        const data = await this.adminService.getAllVehicles(parseInt(page), parseInt(limit), verifiedBool);
        return { message: 'Vehicles fetched successfully', data };
    }
    async getAllBookings(page = '1', limit = '20', status) {
        const data = await this.adminService.getAllBookings(parseInt(page), parseInt(limit), status);
        return { message: 'Bookings fetched successfully', data };
    }
    async getAllPayments(page = '1', limit = '20') {
        const data = await this.adminService.getAllPayments(parseInt(page), parseInt(limit));
        return { message: 'Payments fetched successfully', data };
    }
    async getAllPayouts(page = '1', limit = '20', status) {
        const data = await this.adminService.getAllPayouts(parseInt(page), parseInt(limit), status);
        return { message: 'Payouts fetched successfully', data };
    }
    async getAuditLogs(page = '1', limit = '20', action) {
        const data = await this.adminService.getAuditLogs(parseInt(page), parseInt(limit), action);
        return { message: 'Audit logs fetched successfully', data };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List all users' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('role')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate or deactivate a user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Get)('kyc'),
    (0, swagger_1.ApiOperation)({ summary: 'List all KYC submissions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllKyc", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    (0, swagger_1.ApiOperation)({ summary: 'List all vehicles' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'verified', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('verified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllVehicles", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'List all bookings' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all payments' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('payouts'),
    (0, swagger_1.ApiOperation)({ summary: 'List all payouts' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPayouts", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'List audit logs' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map