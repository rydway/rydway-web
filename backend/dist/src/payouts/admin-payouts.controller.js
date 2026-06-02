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
exports.AdminPayoutsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payouts_service_1 = require("./payouts.service");
const payouts_dto_1 = require("./dto/payouts.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let AdminPayoutsController = class AdminPayoutsController {
    payoutsService;
    constructor(payoutsService) {
        this.payoutsService = payoutsService;
    }
    async getAllPayouts(status) {
        const data = await this.payoutsService.getAllPayouts(status);
        return {
            message: 'Payouts fetched successfully',
            data,
        };
    }
    async markPayoutPaid(admin, id, dto) {
        const data = await this.payoutsService.markPayoutPaid(admin.id, id, dto.transactionRef);
        return {
            message: 'Payout marked as paid',
            data,
        };
    }
};
exports.AdminPayoutsController = AdminPayoutsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payouts (Admin only)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPayoutsController.prototype, "getAllPayouts", null);
__decorate([
    (0, common_1.Patch)(':id/mark-paid'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark payout as paid (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, payouts_dto_1.MarkPayoutPaidDto]),
    __metadata("design:returntype", Promise)
], AdminPayoutsController.prototype, "markPayoutPaid", null);
exports.AdminPayoutsController = AdminPayoutsController = __decorate([
    (0, swagger_1.ApiTags)('Payouts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Controller)('payouts'),
    __metadata("design:paramtypes", [payouts_service_1.PayoutsService])
], AdminPayoutsController);
//# sourceMappingURL=admin-payouts.controller.js.map