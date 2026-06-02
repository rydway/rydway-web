import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto, UpdateVehicleStatusDto, AddVehicleMediaDto } from './dto/vehicles.dto';
import { AddMaintenanceLogDto } from './dto/maintenance.dto';
import { VehicleStatus, Prisma } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
  }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) {
      throw new BadRequestException('Host profile not found. Complete KYC first.');
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

  async updateVehicle(userId: string, vehicleId: string, dto: UpdateVehicleDto) {
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

  async updateVehicleStatus(userId: string, vehicleId: string, dto: UpdateVehicleStatusDto) {
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

  async deleteVehicle(userId: string, vehicleId: string) {
    const vehicle = await this.getVehicleById(vehicleId);
    await this.ensureOwnership(userId, vehicle.hostId);

    const deleted = await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: VehicleStatus.archived },
    });

    await this.auditLogService.logAction({
      actorId: userId,
      action: 'VEHICLE_DELETED_SOFT',
      entityType: 'Vehicle',
      entityId: vehicle.id,
    });

    return deleted;
  }

  async addVehicleMedia(userId: string, vehicleId: string, dto: AddVehicleMediaDto) {
    const vehicle = await this.getVehicleById(vehicleId);
    await this.ensureOwnership(userId, vehicle.hostId);

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

  async removeVehicleMedia(userId: string, vehicleId: string, mediaId: string) {
    const vehicle = await this.getVehicleById(vehicleId);
    await this.ensureOwnership(userId, vehicle.hostId);

    const media = await this.prisma.vehicleImage.findUnique({ where: { id: mediaId } });
    if (!media || media.vehicleId !== vehicleId) {
      throw new NotFoundException('Media not found for this vehicle');
    }

    await this.prisma.vehicleImage.delete({ where: { id: mediaId } });
    return true;
  }

  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: 'asc' } },
        host: {
          include: { user: { select: { firstName: true, lastName: true, kycStatus: true } } },
        },
      },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async getPublicVehicles() {
    // Basic public query - SearchModule will handle advanced queries
    return this.prisma.vehicle.findMany({
      where: { status: VehicleStatus.available, isVerified: true },
      include: { images: true },
      take: 20,
    });
  }

  async getHostVehicles(userId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) return [];

    return this.prisma.vehicle.findMany({
      where: { hostId: hostProfile.id },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyVehicle(adminId: string, vehicleId: string, isVerified: boolean) {
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

  async addMaintenanceLog(userId: string, vehicleId: string, dto: AddMaintenanceLogDto) {
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

  async getCalendar(id: string, startDateStr?: string, endDateStr?: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const queryParams: any = { vehicleId: id };
    const dateFilters: any = {};
    if (startDateStr) dateFilters.gte = new Date(startDateStr);
    if (endDateStr) dateFilters.lte = new Date(endDateStr);

    if (Object.keys(dateFilters).length > 0) {
      queryParams.startDate = dateFilters;
    }

    // 1. Get confirmed/paid/active bookings
    const bookings = await this.prisma.booking.findMany({
      where: {
        ...queryParams,
        status: { in: ['confirmed', 'paid', 'active'] },
      },
      select: { id: true, startDate: true, endDate: true },
    });

    // 2. Get manual blocks
    const blocks = await this.prisma.vehicleBlock.findMany({
      where: queryParams,
      select: { id: true, startDate: true, endDate: true, reason: true },
    });

    // Merge and format
    const calendar = [
      ...bookings.map(b => ({ type: 'booking', id: b.id, startDate: b.startDate, endDate: b.endDate })),
      ...blocks.map(b => ({ type: 'manual_block', id: b.id, startDate: b.startDate, endDate: b.endDate, reason: b.reason }))
    ];

    return calendar.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async addCalendarBlock(vehicleId: string, userId: string, data: { startDate: string; endDate: string; reason?: string }) {
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

  async removeCalendarBlock(vehicleId: string, blockId: string, userId: string) {
    const vehicle = await this.getVehicleById(vehicleId);
    await this.ensureOwnership(userId, vehicle.hostId);

    const block = await this.prisma.vehicleBlock.findUnique({ where: { id: blockId } });
    if (!block || block.vehicleId !== vehicleId) {
      throw new NotFoundException('Block not found');
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

  async getHostStorefront(hostId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { id: hostId },
      include: {
        user: { select: { firstName: true, lastName: true, profileImageUrl: true, createdAt: true } },
        vehicles: {
          where: { status: VehicleStatus.available, isVerified: true },
          include: { images: true },
        },
      },
    });

    if (!hostProfile) throw new NotFoundException('Host profile not found');

    return hostProfile;
  }

  private async ensureOwnership(userId: string, vehicleHostId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile || hostProfile.id !== vehicleHostId) {
      throw new ForbiddenException('You do not own this vehicle');
    }
  }
}

