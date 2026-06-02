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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    prisma;
    auditLogService;
    constructor(prisma, auditLogService) {
        this.prisma = prisma;
        this.auditLogService = auditLogService;
    }
    async getCompletedBookingForRenter(renterId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.renterId !== renterId)
            throw new common_1.ForbiddenException('Not your booking');
        if (booking.status !== client_1.BookingStatus.completed) {
            throw new common_1.BadRequestException('You can only review completed bookings');
        }
        return booking;
    }
    async createVehicleReview(renterId, dto) {
        const booking = await this.getCompletedBookingForRenter(renterId, dto.bookingId);
        const existing = await this.prisma.review.findFirst({
            where: { bookingId: dto.bookingId, type: 'vehicle' },
        });
        if (existing)
            throw new common_1.BadRequestException('You have already reviewed this booking');
        const review = await this.prisma.$transaction(async (tx) => {
            const r = await tx.review.create({
                data: {
                    bookingId: dto.bookingId,
                    vehicleId: booking.vehicleId,
                    reviewerId: renterId,
                    revieweeId: booking.vehicle.hostId,
                    type: 'vehicle',
                    rating: dto.rating,
                    body: dto.body,
                },
            });
            const allReviews = await tx.review.findMany({
                where: { vehicleId: booking.vehicleId, type: 'vehicle' },
                select: { rating: true },
            });
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await tx.vehicle.update({
                where: { id: booking.vehicleId },
                data: { avgRating, totalReviews: allReviews.length },
            });
            return r;
        });
        await this.auditLogService.logAction({
            actorId: renterId,
            action: 'REVIEW_VEHICLE_CREATED',
            entityType: 'Review',
            entityId: review.id,
        });
        return review;
    }
    async createHostReview(renterId, dto) {
        const booking = await this.getCompletedBookingForRenter(renterId, dto.bookingId);
        const existing = await this.prisma.review.findFirst({
            where: { bookingId: dto.bookingId, type: 'host' },
        });
        if (existing)
            throw new common_1.BadRequestException('You have already reviewed this host for this booking');
        const hostProfile = await this.prisma.hostProfile.findUnique({
            where: { id: booking.vehicle.hostId },
        });
        if (!hostProfile)
            throw new common_1.NotFoundException('Host profile not found');
        const review = await this.prisma.$transaction(async (tx) => {
            const r = await tx.review.create({
                data: {
                    bookingId: dto.bookingId,
                    vehicleId: booking.vehicleId,
                    reviewerId: renterId,
                    revieweeId: hostProfile.userId,
                    type: 'host',
                    rating: dto.hostRating,
                    body: dto.hostComment,
                },
            });
            const allReviews = await tx.review.findMany({
                where: { revieweeId: hostProfile.userId, type: 'host' },
                select: { rating: true },
            });
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await tx.hostProfile.update({
                where: { id: hostProfile.id },
                data: { avgRating, totalReviews: allReviews.length },
            });
            return r;
        });
        return review;
    }
    async createRenterReview(hostUserId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== client_1.BookingStatus.completed) {
            throw new common_1.BadRequestException('You can only review completed bookings');
        }
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
        if (!hostProfile || booking.vehicle.hostId !== hostProfile.id) {
            throw new common_1.ForbiddenException('Not your booking to review');
        }
        const existing = await this.prisma.review.findFirst({
            where: { bookingId: dto.bookingId, type: 'renter' },
        });
        if (existing)
            throw new common_1.BadRequestException('You have already reviewed this renter for this booking');
        const review = await this.prisma.$transaction(async (tx) => {
            const r = await tx.review.create({
                data: {
                    bookingId: dto.bookingId,
                    vehicleId: booking.vehicleId,
                    reviewerId: hostUserId,
                    revieweeId: booking.renterId,
                    type: 'renter',
                    rating: dto.renterRating,
                    body: dto.renterComment,
                },
            });
            const allReviews = await tx.review.findMany({
                where: { revieweeId: booking.renterId, type: 'renter' },
                select: { rating: true },
            });
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await tx.renterProfile.updateMany({
                where: { userId: booking.renterId },
                data: { avgRating, totalReviews: allReviews.length },
            });
            return r;
        });
        await this.auditLogService.logAction({
            actorId: hostUserId,
            action: 'REVIEW_RENTER_CREATED',
            entityType: 'Review',
            entityId: review.id,
        });
        return review;
    }
    async getVehicleReviews(vehicleId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { vehicleId, type: 'vehicle' },
                include: {
                    reviewer: { select: { firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.review.count({ where: { vehicleId, type: 'vehicle' } }),
        ]);
        return { reviews, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getHostReviews(hostUserId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { revieweeId: hostUserId, type: 'host' },
                include: {
                    reviewer: { select: { firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.review.count({ where: { revieweeId: hostUserId, type: 'host' } }),
        ]);
        return { reviews, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getMyReceivedReviews(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { revieweeId: userId },
                include: {
                    reviewer: { select: { firstName: true, lastName: true } },
                    vehicle: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.review.count({ where: { revieweeId: userId } }),
        ]);
        return { reviews, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map