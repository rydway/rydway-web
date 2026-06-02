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
exports.HostEarningsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payouts_service_1 = require("./payouts.service");
const payouts_dto_1 = require("./dto/payouts.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let HostEarningsController = class HostEarningsController {
    payoutsService;
    constructor(payoutsService) {
        this.payoutsService = payoutsService;
    }
    async getSummary(user) {
        const data = await this.payoutsService.getHostEarningsSummary(user.id);
        return {
            message: 'Earnings summary fetched successfully',
            data,
        };
    }
    async getTransactions(user) {
        const data = await this.payoutsService.getHostTransactions(user.id);
        return {
            message: 'Transactions fetched successfully',
            data,
        };
    }
    async withdraw(user, dto) {
        const amount = parseFloat(dto.amount);
        const data = await this.payoutsService.requestWithdrawal(user.id, amount);
        return {
            message: 'Withdrawal requested successfully',
            data,
        };
    }
};
exports.HostEarningsController = HostEarningsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get host earnings summary' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostEarningsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get host payout transactions' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostEarningsController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a withdrawal of earnings' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payouts_dto_1.WithdrawEarningsDto]),
    __metadata("design:returntype", Promise)
], HostEarningsController.prototype, "withdraw", null);
exports.HostEarningsController = HostEarningsController = __decorate([
    (0, swagger_1.ApiTags)('Host Fleet'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, common_1.Controller)('host/earnings'),
    __metadata("design:paramtypes", [payouts_service_1.PayoutsService])
], HostEarningsController);
//# sourceMappingURL=host-earnings.controller.js.map