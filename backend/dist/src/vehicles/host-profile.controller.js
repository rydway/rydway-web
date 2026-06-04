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
exports.HostProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vehicles_service_1 = require("./vehicles.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let HostProfileController = class HostProfileController {
    vehiclesService;
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async getHostStorefront(hostId) {
        const data = await this.vehiclesService.getHostStorefront(hostId);
        return {
            message: 'Host storefront profile fetched successfully',
            data,
        };
    }
};
exports.HostProfileController = HostProfileController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':hostId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public storefront for a host' }),
    __param(0, (0, common_1.Param)('hostId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HostProfileController.prototype, "getHostStorefront", null);
exports.HostProfileController = HostProfileController = __decorate([
    (0, swagger_1.ApiTags)('Host Storefront'),
    (0, common_1.Controller)('host/profile'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], HostProfileController);
//# sourceMappingURL=host-profile.controller.js.map