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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let VehiclesService = class VehiclesService {
    prisma;
    auditLogService;
    constructor(prisma, auditLogService) {
        this.prisma = prisma;
        this.auditLogService = auditLogService;
    }
    generateSlug(name) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
    }
    async createVehicle(userId, dto) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile) {
            throw new common_1.BadRequestException('Host profile not found. Complete KYC first.');
        }
        const vehicle = await this.prisma.vehicle.create({
            data: {
                hostId: hostProfile.id,
                name: dto.name,
                slug: this.generateSlug(dto.name),
                category: dto.category,
                fuelType: dto.fuelType,
                transmission: dto.transmission,
                seats: dto.seats,
                dailyRate: dto.dailyRate,
                securityDeposit: dto.securityDeposit,
                location: dto.location,
                latitude: dto.latitude,
                longitude: dto.longitude,
                description: dto.description,
                requiresDriver: dto.requiresDriver,
                minimumRentalDays: dto.minimumRentalDays,
            },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'VEHICLE_CREATED',
            entityType: 'Vehicle',
            entityId: vehicle.id,
        });
        return vehicle;
    }
    async updateVehicle(userId, vehicleId, dto) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const updated = await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: dto,
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'VEHICLE_UPDATED',
            entityType: 'Vehicle',
            entityId: vehicle.id,
        });
        return updated;
    }
    async updateVehicleStatus(userId, vehicleId, dto) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const updated = await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { status: dto.status },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: `VEHICLE_STATUS_CHANGED_TO_${dto.status.toUpperCase()}`,
            entityType: 'Vehicle',
            entityId: vehicle.id,
        });
        return updated;
    }
    async deleteVehicle(userId, vehicleId) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const deleted = await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { status: client_1.VehicleStatus.archived },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'VEHICLE_DELETED_SOFT',
            entityType: 'Vehicle',
            entityId: vehicle.id,
        });
        return deleted;
    }
    async addVehicleMedia(userId, vehicleId, dto) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const allowedExtensions = /\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i;
        const isSupabaseUrl = dto.url.includes('.supabase.co/storage/');
        if (!allowedExtensions.test(dto.url) && !isSupabaseUrl) {
            throw new common_1.BadRequestException('Vehicle media must be an image URL (jpg, jpeg, png, webp, gif, avif)');
        }
        const media = await this.prisma.vehicleImage.create({
            data: {
                vehicleId,
                url: dto.url,
                position: dto.position,
                isPrimary: dto.isPrimary,
            },
        });
        return media;
    }
    async removeVehicleMedia(userId, vehicleId, mediaId) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const media = await this.prisma.vehicleImage.findUnique({ where: { id: mediaId } });
        if (!media || media.vehicleId !== vehicleId) {
            throw new common_1.NotFoundException('Media not found for this vehicle');
        }
        await this.prisma.vehicleImage.delete({ where: { id: mediaId } });
        return true;
    }
    async getVehicleById(id) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
            include: {
                images: { orderBy: { position: 'asc' } },
                host: {
                    include: { user: { select: { firstName: true, lastName: true, kycStatus: true } } },
                },
            },
        });
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found');
        return vehicle;
    }
    async getPublicVehicles() {
        return this.prisma.vehicle.findMany({
            where: { status: client_1.VehicleStatus.available, isVerified: true },
            include: { images: true },
            take: 20,
        });
    }
    async getHostVehicles(userId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile)
            return [];
        return this.prisma.vehicle.findMany({
            where: { hostId: hostProfile.id },
            include: { images: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async verifyVehicle(adminId, vehicleId, isVerified) {
        const vehicle = await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { isVerified },
        });
        await this.auditLogService.logAction({
            actorId: adminId,
            action: isVerified ? 'VEHICLE_VERIFIED' : 'VEHICLE_REJECTED',
            entityType: 'Vehicle',
            entityId: vehicle.id,
        });
        return vehicle;
    }
    async addMaintenanceLog(userId, vehicleId, dto) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const log = await this.prisma.maintenanceLog.create({
            data: {
                vehicleId,
                title: dto.title,
                description: dto.description,
                maintenanceDate: new Date(dto.maintenanceDate),
                cost: dto.cost,
                createdBy: userId,
            },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'VEHICLE_MAINTENANCE_LOGGED',
            entityType: 'MaintenanceLog',
            entityId: log.id,
        });
        return log;
    }
    async getCalendar(id, startDateStr, endDateStr) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found');
        const queryParams = { vehicleId: id };
        const dateFilters = {};
        if (startDateStr)
            dateFilters.gte = new Date(startDateStr);
        if (endDateStr)
            dateFilters.lte = new Date(endDateStr);
        if (Object.keys(dateFilters).length > 0) {
            queryParams.startDate = dateFilters;
        }
        const bookings = await this.prisma.booking.findMany({
            where: {
                ...queryParams,
                status: { in: ['confirmed', 'paid', 'active'] },
            },
            select: { id: true, startDate: true, endDate: true },
        });
        const blocks = await this.prisma.vehicleBlock.findMany({
            where: queryParams,
            select: { id: true, startDate: true, endDate: true, reason: true },
        });
        const calendar = [
            ...bookings.map(b => ({ type: 'booking', id: b.id, startDate: b.startDate, endDate: b.endDate })),
            ...blocks.map(b => ({ type: 'manual_block', id: b.id, startDate: b.startDate, endDate: b.endDate, reason: b.reason }))
        ];
        return calendar.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    async addCalendarBlock(vehicleId, userId, data) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const block = await this.prisma.vehicleBlock.create({
            data: {
                vehicleId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason,
            },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'VEHICLE_CALENDAR_BLOCK_ADDED',
            entityType: 'VehicleBlock',
            entityId: block.id,
        });
        return block;
    }
    async removeCalendarBlock(vehicleId, blockId, userId) {
        const vehicle = await this.getVehicleById(vehicleId);
        await this.ensureOwnership(userId, vehicle.hostId);
        const block = await this.prisma.vehicleBlock.findUnique({ where: { id: blockId } });
        if (!block || block.vehicleId !== vehicleId) {
            throw new common_1.NotFoundException('Block not found');
        }
        await this.prisma.vehicleBlock.delete({ where: { id: blockId } });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'VEHICLE_CALENDAR_BLOCK_REMOVED',
            entityType: 'VehicleBlock',
            entityId: block.id,
        });
        return { success: true };
    }
    async getHostStorefront(hostId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({
            where: { id: hostId },
            include: {
                user: { select: { firstName: true, lastName: true, profileImageUrl: true, createdAt: true } },
                vehicles: {
                    where: { status: client_1.VehicleStatus.available, isVerified: true },
                    include: { images: true },
                },
            },
        });
        if (!hostProfile)
            throw new common_1.NotFoundException('Host profile not found');
        return hostProfile;
    }
    async ensureOwnership(userId, vehicleHostId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile || hostProfile.id !== vehicleHostId) {
            throw new common_1.ForbiddenException('You do not own this vehicle');
        }
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map