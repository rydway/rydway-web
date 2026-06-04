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
exports.HostVehiclesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vehicles_service_1 = require("./vehicles.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const policy_guard_1 = require("../common/guards/policy.guard");
const policies_decorator_1 = require("../common/policies/policies.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const vehicles_dto_1 = require("./dto/vehicles.dto");
const maintenance_dto_1 = require("./dto/maintenance.dto");
let HostVehiclesController = class HostVehiclesController {
    vehiclesService;
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async getMyVehicles(user) {
        const data = await this.vehiclesService.getHostVehicles(user.id);
        return {
            message: 'Vehicles fetched successfully',
            data,
        };
    }
    async createVehicle(user, dto) {
        const data = await this.vehiclesService.createVehicle(user.id, dto);
        return {
            message: 'Vehicle created successfully',
            data,
        };
    }
    async getVehicleById(user, id) {
        const data = await this.vehiclesService.getVehicleById(id);
        return {
            message: 'Vehicle fetched successfully',
            data,
        };
    }
    async updateVehicle(user, id, dto) {
        const data = await this.vehiclesService.updateVehicle(user.id, id, dto);
        return {
            message: 'Vehicle updated successfully',
            data,
        };
    }
    async updateVehicleStatus(user, id, dto) {
        const data = await this.vehiclesService.updateVehicleStatus(user.id, id, dto);
        return {
            message: 'Vehicle status updated successfully',
            data,
        };
    }
    async deleteVehicle(user, id) {
        const data = await this.vehiclesService.deleteVehicle(user.id, id);
        return {
            message: 'Vehicle deleted successfully',
            data,
        };
    }
    async addVehicleMedia(user, id, dto) {
        const data = await this.vehiclesService.addVehicleMedia(user.id, id, dto);
        return {
            message: 'Media added successfully',
            data,
        };
    }
    async removeVehicleMedia(user, id, mediaId) {
        const data = await this.vehiclesService.removeVehicleMedia(user.id, id, mediaId);
        return {
            message: 'Media removed successfully',
            data,
        };
    }
    async addMaintenanceLog(user, id, dto) {
        const data = await this.vehiclesService.addMaintenanceLog(user.id, id, dto);
        return {
            message: 'Maintenance log added successfully',
            data,
        };
    }
};
exports.HostVehiclesController = HostVehiclesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get host vehicles' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "getMyVehicles", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new vehicle' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vehicles_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "createVehicle", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get host vehicle details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "getVehicleById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicles_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "updateVehicle", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicles_dto_1.UpdateVehicleStatusDto]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "updateVehicleStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete vehicle' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "deleteVehicle", null);
__decorate([
    (0, common_1.Post)(':id/media'),
    (0, swagger_1.ApiOperation)({ summary: 'Add vehicle media' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, vehicles_dto_1.AddVehicleMediaDto]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "addVehicleMedia", null);
__decorate([
    (0, common_1.Delete)(':id/media/:mediaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove vehicle media' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('mediaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "removeVehicleMedia", null);
__decorate([
    (0, common_1.Post)(':id/maintenance'),
    (0, swagger_1.ApiOperation)({ summary: 'Add vehicle maintenance log' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, maintenance_dto_1.AddMaintenanceLogDto]),
    __metadata("design:returntype", Promise)
], HostVehiclesController.prototype, "addMaintenanceLog", null);
exports.HostVehiclesController = HostVehiclesController = __decorate([
    (0, swagger_1.ApiTags)('Host Fleet'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, policy_guard_1.PolicyGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.host),
    (0, policies_decorator_1.RequireActiveStatus)(),
    (0, common_1.Controller)('host/vehicles'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], HostVehiclesController);
//# sourceMappingURL=host-vehicles.controller.js.map