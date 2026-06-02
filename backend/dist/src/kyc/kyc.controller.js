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
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kyc_service_1 = require("./kyc.service");
const kyc_dto_1 = require("./dto/kyc.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const policy_guard_1 = require("../common/guards/policy.guard");
const policies_decorator_1 = require("../common/policies/policies.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let KycController = class KycController {
    kycService;
    constructor(kycService) {
        this.kycService = kycService;
    }
    async submitRenterKyc(user, dto) {
        const data = await this.kycService.submitRenterKyc(user.id, dto);
        return {
            message: 'Renter KYC submitted successfully',
            data,
        };
    }
    async submitHostKyc(user, dto) {
        const data = await this.kycService.submitHostKyc(user.id, dto);
        return {
            message: 'Host KYC submitted successfully',
            data,
        };
    }
    async getMyKyc(user) {
        const data = await this.kycService.getMyKyc(user.id);
        return {
            message: 'KYC submissions fetched successfully',
            data,
        };
    }
    async getKycById(id) {
        const data = await this.kycService.getKycById(id);
        return {
            message: 'KYC submission fetched successfully',
            data,
        };
    }
    async approveKyc(id, admin, dto) {
        const data = await this.kycService.approveKyc(id, admin.id, dto);
        return {
            message: 'KYC approved successfully',
            data,
        };
    }
    async rejectKyc(id, admin, dto) {
        const data = await this.kycService.rejectKyc(id, admin.id, dto);
        return {
            message: 'KYC rejected successfully',
            data,
        };
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Post)('renter'),
    (0, roles_decorator_1.Roles)(client_1.Role.renter),
    (0, swagger_1.ApiOperation)({ summary: 'Submit renter KYC (Renter only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_dto_1.SubmitRenterKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "submitRenterKyc", null);
__decorate([
    (0, common_1.Post)('host'),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Submit host KYC (Host only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_dto_1.SubmitHostKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "submitHostKyc", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user KYC submissions' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getMyKyc", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC submission by ID (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getKycById", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Approve KYC submission (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, kyc_dto_1.ReviewKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "approveKyc", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Reject KYC submission (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, kyc_dto_1.ReviewKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "rejectKyc", null);
exports.KycController = KycController = __decorate([
    (0, swagger_1.ApiTags)('KYC'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, policy_guard_1.PolicyGuard, roles_guard_1.RolesGuard),
    (0, policies_decorator_1.RequireActiveStatus)(),
    (0, common_1.Controller)('kyc'),
    __metadata("design:paramtypes", [kyc_service_1.KycService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map