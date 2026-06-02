import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SearchVehiclesDto } from './dto/search.dto';
import { Prisma, VehicleStatus, BookingStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  private generateCacheKey(dto: any): string {
    const hash = crypto.createHash('md5').update(JSON.stringify(dto)).digest('hex');
    return `search:vehicles:${hash}`;
  }

  async searchVehicles(dto: SearchVehiclesDto) {
    const cacheKey = this.generateCacheKey(dto);
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const {
      location,
      latitude,
      longitude,
      radius,
      startDate,
      endDate,
      category,
      priceMin,
      priceMax,
      seats,
      transmission,
      fuelType,
      verifiedOnly,
      featuredOnly,
      page = 1,
      limit = 20,
    } = dto;

    const where: Prisma.VehicleWhereInput = {
      status: VehicleStatus.available,
    };

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (category) where.category = category;
    if (transmission) where.transmission = transmission;
    if (fuelType) where.fuelType = fuelType;
    if (verifiedOnly) where.isVerified = true;
    if (featuredOnly) where.isFeatured = true;

    if (priceMin || priceMax) {
      where.dailyRate = {};
      if (priceMin) where.dailyRate.gte = priceMin;
      if (priceMax) where.dailyRate.lte = priceMax;
    }

    if (seats) {
      where.seats = { gte: seats };
    }

    // Date Availability Conflict Checks
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      where.bookings = {
        none: {
          status: { in: [BookingStatus.confirmed, BookingStatus.paid, BookingStatus.active] },
          OR: [
            {
              startDate: { lte: end },
              endDate: { gte: start },
            },
          ],
        },
      };
    }

    // Geospatial rough filter
    if (latitude && longitude && radius) {
      // 1 degree ~ 111 km
      const latDiff = radius / 111;
      const lonDiff = radius / (111 * Math.cos(latitude * (Math.PI / 180)));

      where.latitude = { gte: latitude - latDiff, lte: latitude + latDiff };
      where.longitude = { gte: longitude - lonDiff, lte: longitude + lonDiff };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: { images: { orderBy: { position: 'asc' } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    const result = {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 5 minutes
    await this.redisService.setex(cacheKey, 300, JSON.stringify(result));

    return result;
  }

  async getFilters() {
    const cacheKey = 'search:filters';
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [categories, fuelTypes, transmissions] = await Promise.all([
      this.prisma.vehicle.groupBy({ by: ['category'] }),
      this.prisma.vehicle.groupBy({ by: ['fuelType'] }),
      this.prisma.vehicle.groupBy({ by: ['transmission'] }),
    ]);

    const result = {
      categories: categories.map(c => c.category).filter(Boolean),
      fuelTypes: fuelTypes.map(f => f.fuelType).filter(Boolean),
      transmissions: transmissions.map(t => t.transmission).filter(Boolean),
    };

    await this.redisService.setex(cacheKey, 3600, JSON.stringify(result)); // Cache 1 hour
    return result;
  }

  async searchHosts(query: string) {
    const where: Prisma.HostProfileWhereInput = {};
    if (query) {
      where.OR = [
        { businessName: { contains: query, mode: 'insensitive' } },
        { user: { firstName: { contains: query, mode: 'insensitive' } } },
        { user: { lastName: { contains: query, mode: 'insensitive' } } },
      ];
    }
    return this.prisma.hostProfile.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
      },
      take: 10,
    });
  }

  async autocomplete(query: string) {
    if (!query) return { vehicles: [], locations: [] };
    const [vehicles, locations] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { name: { contains: query, mode: 'insensitive' }, status: VehicleStatus.available },
        select: { name: true },
        distinct: ['name'],
        take: 5,
      }),
      this.prisma.vehicle.findMany({
        where: { location: { contains: query, mode: 'insensitive' }, status: VehicleStatus.available },
        select: { location: true },
        distinct: ['location'],
        take: 5,
      }),
    ]);

    return {
      vehicles: vehicles.map(v => v.name),
      locations: locations.map(l => l.location),
    };
  }
}

