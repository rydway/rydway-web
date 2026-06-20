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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    redisService;
    constructor(prisma, redisService) {
        this.prisma = prisma;
        this.redisService = redisService;
    }
    async getRenterSummary(renterId) {
        const cacheKey = `dashboard:renter:${renterId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const [totalBookings, activeBookings, completedBookings, pendingPayments, totalSpend, recentBookings,] = await Promise.all([
            this.prisma.booking.count({ where: { renterId } }),
            this.prisma.booking.count({ where: { renterId, status: client_1.BookingStatus.active } }),
            this.prisma.booking.count({ where: { renterId, status: client_1.BookingStatus.completed } }),
            this.prisma.booking.count({ where: { renterId, status: client_1.BookingStatus.confirmed } }),
            this.prisma.booking.aggregate({
                where: { renterId, status: client_1.BookingStatus.completed },
                _sum: { totalAmount: true },
            }),
            this.prisma.booking.findMany({
                where: { renterId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { vehicle: { include: { images: { take: 1 } } } },
            }),
        ]);
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        const [currentMonthBookings, lastMonthBookings, currentMonthSpend, lastMonthSpend] = await Promise.all([
            this.prisma.booking.count({ where: { renterId, createdAt: { gte: currentMonthStart } } }),
            this.prisma.booking.count({ where: { renterId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
            this.prisma.booking.aggregate({
                where: { renterId, status: client_1.BookingStatus.completed, createdAt: { gte: currentMonthStart } },
                _sum: { totalAmount: true },
            }),
            this.prisma.booking.aggregate({
                where: { renterId, status: client_1.BookingStatus.completed, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
                _sum: { totalAmount: true },
            }),
        ]);
        const calculateTrend = (current, previous) => {
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
        const result = {
            totalBookings,
            activeBookings,
            completedBookings,
            pendingPayments,
            totalSpend: totalSpend._sum.totalAmount ?? 0,
            recentBookings,
            trends: {
                bookings: calculateTrend(currentMonthBookings, lastMonthBookings),
                spend: calculateTrend(currentMonthSpend._sum.totalAmount ?? 0, lastMonthSpend._sum.totalAmount ?? 0),
            }
        };
        await this.redisService.setex(cacheKey, 120, JSON.stringify(result));
        return result;
    }
    async getHostSummary(userId) {
        const cacheKey = `dashboard:host:${userId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
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
        const [totalVehicles, availableVehicles, pendingRequests, activeBookings, completedBookings, payouts, recentRequests, fleetSnapshot,] = await Promise.all([
            this.prisma.vehicle.count({ where: { hostId: hostProfile.id } }),
            this.prisma.vehicle.count({ where: { hostId: hostProfile.id, status: client_1.VehicleStatus.available } }),
            this.prisma.booking.count({ where: { hostId: hostProfile.id, status: client_1.BookingStatus.requested } }),
            this.prisma.booking.count({ where: { hostId: hostProfile.id, status: client_1.BookingStatus.active } }),
            this.prisma.booking.aggregate({
                where: { hostId: hostProfile.id, status: client_1.BookingStatus.completed },
                _sum: { baseAmount: true },
            }),
            this.prisma.payout.findMany({
                where: { hostId: hostProfile.id },
                select: { amount: true, status: true },
            }),
            this.prisma.booking.findMany({
                where: { hostId: hostProfile.id, status: client_1.BookingStatus.requested },
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
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        const [currentMonthBookings, lastMonthBookings, currentMonthEarned, lastMonthEarned] = await Promise.all([
            this.prisma.booking.count({ where: { hostId: hostProfile.id, createdAt: { gte: currentMonthStart } } }),
            this.prisma.booking.count({ where: { hostId: hostProfile.id, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
            this.prisma.booking.aggregate({
                where: { hostId: hostProfile.id, status: client_1.BookingStatus.completed, createdAt: { gte: currentMonthStart } },
                _sum: { baseAmount: true },
            }),
            this.prisma.booking.aggregate({
                where: { hostId: hostProfile.id, status: client_1.BookingStatus.completed, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
                _sum: { baseAmount: true },
            }),
        ]);
        const calculateTrend = (current, previous) => {
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
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
            trends: {
                bookings: calculateTrend(currentMonthBookings, lastMonthBookings),
                earnings: calculateTrend(currentMonthEarned._sum.baseAmount ?? 0, lastMonthEarned._sum.baseAmount ?? 0),
            }
        };
        await this.redisService.setex(cacheKey, 120, JSON.stringify(result));
        return result;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map