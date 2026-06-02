"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let SearchService = class SearchService {
    prisma;
    redisService;
    constructor(prisma, redisService) {
        this.prisma = prisma;
        this.redisService = redisService;
    }
    generateCacheKey(dto) {
        const hash = crypto.createHash('md5').update(JSON.stringify(dto)).digest('hex');
        return `search:vehicles:${hash}`;
    }
    async searchVehicles(dto) {
        const cacheKey = this.generateCacheKey(dto);
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const { location, latitude, longitude, radius, startDate, endDate, category, priceMin, priceMax, seats, transmission, fuelType, verifiedOnly, featuredOnly, page = 1, limit = 20, } = dto;
        const where = {
            status: client_1.VehicleStatus.available,
        };
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (category)
            where.category = category;
        if (transmission)
            where.transmission = transmission;
        if (fuelType)
            where.fuelType = fuelType;
        if (verifiedOnly)
            where.isVerified = true;
        if (featuredOnly)
            where.isFeatured = true;
        if (priceMin || priceMax) {
            where.dailyRate = {};
            if (priceMin)
                where.dailyRate.gte = priceMin;
            if (priceMax)
                where.dailyRate.lte = priceMax;
        }
        if (seats) {
            where.seats = { gte: seats };
        }
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            where.bookings = {
                none: {
                    status: { in: [client_1.BookingStatus.confirmed, client_1.BookingStatus.paid, client_1.BookingStatus.active] },
                    OR: [
                        {
                            startDate: { lte: end },
                            endDate: { gte: start },
                        },
                    ],
                },
            };
        }
        if (latitude && longitude && radius) {
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
        await this.redisService.setex(cacheKey, 300, JSON.stringify(result));
        return result;
    }
    async getFilters() {
        const cacheKey = 'search:filters';
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
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
        await this.redisService.setex(cacheKey, 3600, JSON.stringify(result));
        return result;
    }
    async searchHosts(query) {
        const where = {};
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
    async autocomplete(query) {
        if (!query)
            return { vehicles: [], locations: [] };
        const [vehicles, locations] = await Promise.all([
            this.prisma.vehicle.findMany({
                where: { name: { contains: query, mode: 'insensitive' }, status: client_1.VehicleStatus.available },
                select: { name: true },
                distinct: ['name'],
                take: 5,
            }),
            this.prisma.vehicle.findMany({
                where: { location: { contains: query, mode: 'insensitive' }, status: client_1.VehicleStatus.available },
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
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], SearchService);
//# sourceMappingURL=search.service.js.map