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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const client_1 = require("@prisma/client");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let AdminService = class AdminService {
    prisma;
    redisService;
    auditLogService;
    constructor(prisma, redisService, auditLogService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.auditLogService = auditLogService;
    }
    async getDashboardSummary() {
        const cacheKey = 'admin:dashboard:summary';
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const [totalUsers, totalRenters, totalHosts, totalVehicles, verifiedVehicles, totalBookings, activeBookings, completedBookings, totalRevenue, pendingKyc, pendingPayouts,] = await Promise.all([
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { role: 'renter', isActive: true } }),
            this.prisma.user.count({ where: { role: 'host', isActive: true } }),
            this.prisma.vehicle.count(),
            this.prisma.vehicle.count({ where: { isVerified: true } }),
            this.prisma.booking.count(),
            this.prisma.booking.count({ where: { status: client_1.BookingStatus.active } }),
            this.prisma.booking.count({ where: { status: client_1.BookingStatus.completed } }),
            this.prisma.payment.aggregate({
                where: { status: client_1.PaymentStatus.success },
                _sum: { amount: true },
            }),
            this.prisma.kycSubmission.count({ where: { status: client_1.KycStatus.pending } }),
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
    async getUsers(page = 1, limit = 20, role, search) {
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (role)
            where.role = role;
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
    async getUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                renterProfile: true,
                hostProfile: true,
                kycSubmissions: { orderBy: { createdAt: 'desc' }, take: 3 },
            },
        });
    }
    async updateUserStatus(adminId, userId, isActive) {
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
    async getAllKycSubmissions(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
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
    async getAllVehicles(page = 1, limit = 20, verified) {
        const skip = (page - 1) * limit;
        const where = {};
        if (typeof verified === 'boolean')
            where.isVerified = verified;
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
    async getAllBookings(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
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
    async getAllPayouts(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
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
    async getAuditLogs(page = 1, limit = 20, action) {
        return { items: [], meta: { page, limit, total: 0, totalPages: 0 } };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService])
], AdminService);
//# sourceMappingURL=admin.service.js.map