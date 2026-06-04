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
exports.InspectionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inspections_service_1 = require("./inspections.service");
const inspections_dto_1 = require("./dto/inspections.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let InspectionsController = class InspectionsController {
    inspectionsService;
    constructor(inspectionsService) {
        this.inspectionsService = inspectionsService;
    }
    async createInspection(user, dto) {
        const data = await this.inspectionsService.createInspection(user.id, dto);
        return {
            message: 'Inspection submitted successfully',
            data,
        };
    }
    async getInspectionsForBooking(user, bookingId) {
        const data = await this.inspectionsService.getInspectionsForBooking(user.id, bookingId);
        return {
            message: 'Inspections fetched successfully',
            data,
        };
    }
    async getAllInspections(bookingId) {
        const data = await this.inspectionsService.getAllInspections(bookingId);
        return {
            message: 'All inspections fetched successfully',
            data,
        };
    }
};
exports.InspectionsController = InspectionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.renter, client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a PRE or POST trip inspection (Renter/Host)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, inspections_dto_1.CreateInspectionDto]),
    __metadata("design:returntype", Promise)
], InspectionsController.prototype, "createInspection", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    (0, roles_decorator_1.Roles)(client_1.Role.renter, client_1.Role.host),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inspections for a specific booking' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InspectionsController.prototype, "getInspectionsForBooking", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inspections — optionally filter by bookingId (Admin only)' }),
    __param(0, (0, common_1.Query)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InspectionsController.prototype, "getAllInspections", null);
exports.InspectionsController = InspectionsController = __decorate([
    (0, swagger_1.ApiTags)('Inspections'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('inspections'),
    __metadata("design:paramtypes", [inspections_service_1.InspectionsService])
], InspectionsController);
//# sourceMappingURL=inspections.controller.js.map