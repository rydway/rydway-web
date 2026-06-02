import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { BookingStatus, KycStatus, PaymentStatus, VehicleStatus } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
  ) {}

  async getDashboardSummary() {
    const cacheKey = 'admin:dashboard:summary';
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [
      totalUsers,
      totalRenters,
      totalHosts,
      totalVehicles,
      verifiedVehicles,
      totalBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
      pendingKyc,
      pendingPayouts,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'renter', isActive: true } }),
      this.prisma.user.count({ where: { role: 'host', isActive: true } }),
      this.prisma.vehicle.count(),
      this.prisma.vehicle.count({ where: { isVerified: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.active } }),
      this.prisma.booking.count({ where: { status: BookingStatus.completed } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.success },
        _sum: { amount: true },
      }),
      this.prisma.kycSubmission.count({ where: { status: KycStatus.pending } }),
      this.prisma.payout.count({ where: { status: 'pending' } }),
    ]);

    const result = {
      users: { total: totalUsers, renters: totalRenters, hosts: totalHosts },
      vehicles: { total: totalVehicles, verified: verifiedVehicles },
      bookings: { total: totalBookings, active: activeBookings, completed: completedBookings },
      revenue: { total: totalRevenue._sum.amount ?? 0 },
      pendingKyc,
      pendingPayouts,
    };

    await this.redisService.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getUsers(page = 1, limit = 20, role?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          kycStatus: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        renterProfile: true,
        hostProfile: true,
        kycSubmissions: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
    });
  }

  async updateUserStatus(adminId: string, userId: string, isActive: boolean) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    await this.auditLogService.logAction({
      actorId: adminId,
      action: isActive ? 'ADMIN_USER_ACTIVATED' : 'ADMIN_USER_DEACTIVATED',
      entityType: 'User',
      entityId: userId,
    });

    return user;
  }

  async getAllKycSubmissions(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.kycSubmission.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.kycSubmission.count({ where }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getAllVehicles(page = 1, limit = 20, verified?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (typeof verified === 'boolean') where.isVerified = verified;

    const [items, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: {
          images: { take: 1 },
          host: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getAllBookings(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          vehicle: { select: { name: true } },
          renter: { select: { firstName: true, lastName: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getAllPayments(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        include: { booking: { select: { bookingNumber: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getAllPayouts(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        include: {
          host: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payout.count({ where }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getAuditLogs(page = 1, limit = 20, action?: string) {
    return { items: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }
}
