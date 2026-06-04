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
exports.DisputesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const disputes_service_1 = require("./disputes.service");
const disputes_dto_1 = require("./dto/disputes.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let DisputesController = class DisputesController {
    disputesService;
    constructor(disputesService) {
        this.disputesService = disputesService;
    }
    async raiseDispute(user, dto) {
        const data = await this.disputesService.raiseDispute(user.id, dto);
        return {
            message: 'Dispute raised successfully. An admin will review within 48 hours.',
            data,
        };
    }
    async getMyDisputes(user) {
        const data = await this.disputesService.getMyDisputes(user.id);
        return {
            message: 'Disputes fetched successfully',
            data,
        };
    }
    async getAllDisputes(status) {
        const data = await this.disputesService.getAllDisputes(status);
        return {
            message: 'All disputes fetched successfully',
            data,
        };
    }
    async getDisputeById(id) {
        const data = await this.disputesService.getDisputeById(id);
        return {
            message: 'Dispute fetched successfully',
            data,
        };
    }
    async resolveDispute(admin, id, dto) {
        const data = await this.disputesService.resolveDispute(admin.id, id, dto);
        return {
            message: `Dispute ${dto.outcome === 'RESOLVED' ? 'resolved' : 'rejected'} successfully`,
            data,
        };
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.renter, client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Raise a dispute on a completed booking (Renter/Host)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, disputes_dto_1.RaiseDisputeDto]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "raiseDispute", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(client_1.Role.renter, client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Get my disputes (Renter/Host)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "getMyDisputes", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Get all disputes — optionally filter by status (Admin only)' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "getAllDisputes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Get dispute by ID with full inspection evidence (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "getDisputeById", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve or reject a dispute (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, disputes_dto_1.ResolveDisputeDto]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "resolveDispute", null);
exports.DisputesController = DisputesController = __decorate([
    (0, swagger_1.ApiTags)('Disputes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('disputes'),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService])
], DisputesController);
//# sourceMappingURL=disputes.controller.js.map