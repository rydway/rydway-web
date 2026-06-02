import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { BookingStatus, KycStatus, VehicleStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async getRenterSummary(renterId: string) {
    const cacheKey = `dashboard:renter:${renterId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [
      totalBookings,
      activeBookings,
      completedBookings,
      pendingPayments,
      totalSpend,
      recentBookings,
    ] = await Promise.all([
      this.prisma.booking.count({ where: { renterId } }),
      this.prisma.booking.count({ where: { renterId, status: BookingStatus.active } }),
      this.prisma.booking.count({ where: { renterId, status: BookingStatus.completed } }),
      this.prisma.booking.count({ where: { renterId, status: BookingStatus.confirmed } }),
      this.prisma.booking.aggregate({
        where: { renterId, status: BookingStatus.completed },
        _sum: { totalAmount: true },
      }),
      this.prisma.booking.findMany({
        where: { renterId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { vehicle: { include: { images: { take: 1 } } } },
      }),
    ]);

    const result = {
      totalBookings,
      activeBookings,
      completedBookings,
      pendingPayments,
      totalSpend: totalSpend._sum.totalAmount ?? 0,
      recentBookings,
    };

    await this.redisService.setex(cacheKey, 120, JSON.stringify(result)); // 2 min cache
    return result;
  }

  async getHostSummary(userId: string) {
    const cacheKey = `dashboard:host:${userId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) {
      return {
        totalVehicles: 0,
        availableVehicles: 0,
        pendingRequests: 0,
        activeBookings: 0,
        totalEarned: 0,
        availableBalance: 0,
        avgRating: 0,
        totalReviews: 0,
        recentRequests: [],
        fleetSnapshot: [],
      };
    }

    const [
      totalVehicles,
      availableVehicles,
      pendingRequests,
      activeBookings,
      completedBookings,
      payouts,
      recentRequests,
      fleetSnapshot,
    ] = await Promise.all([
      this.prisma.vehicle.count({ where: { hostId: hostProfile.id } }),
      this.prisma.vehicle.count({ where: { hostId: hostProfile.id, status: VehicleStatus.available } }),
      this.prisma.booking.count({ where: { hostId: hostProfile.id, status: BookingStatus.requested } }),
      this.prisma.booking.count({ where: { hostId: hostProfile.id, status: BookingStatus.active } }),
      this.prisma.booking.aggregate({
        where: { hostId: hostProfile.id, status: BookingStatus.completed },
        _sum: { baseAmount: true },
      }),
      this.prisma.payout.findMany({
        where: { hostId: hostProfile.id },
        select: { amount: true, status: true },
      }),
      this.prisma.booking.findMany({
        where: { hostId: hostProfile.id, status: BookingStatus.requested },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          vehicle: { select: { name: true } },
          renter: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.vehicle.findMany({
        where: { hostId: hostProfile.id },
        take: 5,
        include: { images: { take: 1 } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalEarned = completedBookings._sum.baseAmount ?? 0;
    const totalWithdrawn = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const pendingWithdrawal = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const availableBalance = Math.max(0, totalEarned - totalWithdrawn - pendingWithdrawal);

    const result = {
      totalVehicles,
      availableVehicles,
      pendingRequests,
      activeBookings,
      totalEarned,
      availableBalance,
      avgRating: hostProfile.avgRating,
      totalReviews: hostProfile.totalReviews,
      recentRequests,
      fleetSnapshot,
    };

    await this.redisService.setex(cacheKey, 120, JSON.stringify(result));
    return result;
  }
}
