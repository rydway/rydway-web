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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
let BookingsService = class BookingsService {
    prisma;
    redisService;
    auditLogService;
    PLATFORM_FEE_PERCENTAGE = 0.10;
    constructor(prisma, redisService, auditLogService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.auditLogService = auditLogService;
    }
    generateBookingNumber() {
        return 'BKG-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    async createBooking(renterId, dto) {
        const renter = await this.prisma.user.findUnique({ where: { id: renterId } });
        if (!renter) {
            throw new common_1.NotFoundException('Renter not found');
        }
        if (renter.kycStatus !== client_1.KycStatus.verified) {
            throw new common_1.ForbiddenException('You must complete KYC verification before booking a vehicle');
        }
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id: dto.vehicleId } });
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found');
        if (vehicle.status === client_1.VehicleStatus.archived || vehicle.status === client_1.VehicleStatus.maintenance) {
            throw new common_1.BadRequestException('Vehicle is not available for booking');
        }
        const startDate = (0, date_fns_1.startOfDay)(new Date(dto.startDate));
        const endDate = (0, date_fns_1.endOfDay)(new Date(dto.endDate));
        if (startDate < (0, date_fns_1.startOfDay)(new Date())) {
            throw new common_1.BadRequestException('Start date cannot be in the past');
        }
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        let daysCount = (0, date_fns_1.differenceInDays)(endDate, startDate) + 1;
        if (daysCount < vehicle.minimumRentalDays) {
            throw new common_1.BadRequestException(`Minimum rental days for this vehicle is ${vehicle.minimumRentalDays}`);
        }
        const lockKey = `booking:lock:${vehicle.id}:${startDate.toISOString()}:${endDate.toISOString()}`;
        const acquired = await this.redisService.setnx(lockKey, '1');
        if (!acquired) {
            throw new common_1.BadRequestException('This vehicle is currently being booked for these dates. Please try again later.');
        }
        await this.redisService.expire(lockKey, 60);
        try {
            const overlaps = await this.prisma.booking.findFirst({
                where: {
                    vehicleId: vehicle.id,
                    status: { in: [client_1.BookingStatus.confirmed, client_1.BookingStatus.paid, client_1.BookingStatus.active] },
                    OR: [
                        { startDate: { lte: endDate }, endDate: { gte: startDate } },
                    ],
                },
            });
            if (overlaps) {
                throw new common_1.BadRequestException('Vehicle is not available for the selected dates');
            }
            const baseAmount = vehicle.dailyRate * daysCount;
            const platformFeeAmount = baseAmount * this.PLATFORM_FEE_PERCENTAGE;
            const securityDepositAmount = vehicle.securityDeposit;
            const totalAmount = baseAmount + platformFeeAmount + securityDepositAmount;
            const booking = await this.prisma.booking.create({
                data: {
                    bookingNumber: this.generateBookingNumber(),
                    renterId,
                    hostId: vehicle.hostId,
                    vehicleId: vehicle.id,
                    startDate,
                    endDate,
                    pickupTime: dto.pickupTime,
                    dropoffTime: dto.dropoffTime,
                    pickupLocation: dto.pickupLocation,
                    dropoffLocation: dto.dropoffLocation,
                    daysCount,
                    baseAmount,
                    platformFeeAmount,
                    securityDepositAmount,
                    totalAmount,
                    status: client_1.BookingStatus.requested,
                    approvalStatus: 'pending',
                },
            });
            await this.auditLogService.logAction({
                actorId: renterId,
                action: 'BOOKING_CREATED',
                entityType: 'Booking',
                entityId: booking.id,
            });
            return booking;
        }
        finally {
            await this.redisService.del(lockKey);
        }
    }
    async approveBooking(hostUserId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
        if (booking.vehicle.hostId !== hostProfile?.id) {
            throw new common_1.ForbiddenException('You do not own the vehicle for this booking');
        }
        if (booking.status !== client_1.BookingStatus.requested) {
            throw new common_1.BadRequestException(`Cannot approve booking in ${booking.status} status`);
        }
        const overlaps = await this.prisma.booking.findFirst({
            where: {
                id: { not: booking.id },
                vehicleId: booking.vehicleId,
                status: { in: [client_1.BookingStatus.confirmed, client_1.BookingStatus.paid, client_1.BookingStatus.active] },
                OR: [
                    { startDate: { lte: booking.endDate }, endDate: { gte: booking.startDate } },
                ],
            },
        });
        if (overlaps) {
            await this.prisma.booking.update({
                where: { id: booking.id },
                data: { status: client_1.BookingStatus.cancelled, approvalStatus: 'declined_due_to_conflict' },
            });
            throw new common_1.BadRequestException('This booking overlaps with an already confirmed booking and has been auto-declined.');
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: client_1.BookingStatus.confirmed,
                approvalStatus: 'approved',
                confirmedAt: new Date(),
            },
        });
        await this.auditLogService.logAction({
            actorId: hostUserId,
            action: 'BOOKING_APPROVED',
            entityType: 'Booking',
            entityId: booking.id,
        });
        return updated;
    }
    async declineBooking(hostUserId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
        if (booking.vehicle.hostId !== hostProfile?.id) {
            throw new common_1.ForbiddenException('You do not own the vehicle for this booking');
        }
        if (booking.status !== client_1.BookingStatus.requested) {
            throw new common_1.BadRequestException(`Cannot decline booking in ${booking.status} status`);
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: client_1.BookingStatus.cancelled,
                approvalStatus: 'declined',
            },
        });
        await this.auditLogService.logAction({
            actorId: hostUserId,
            action: 'BOOKING_DECLINED',
            entityType: 'Booking',
            entityId: booking.id,
        });
        return updated;
    }
    async cancelBooking(userId, bookingId, role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (role === 'renter' && booking.renterId !== userId) {
            throw new common_1.ForbiddenException('Not your booking');
        }
        if (role === 'host') {
            const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
            if (booking.vehicle.hostId !== hostProfile?.id) {
                throw new common_1.ForbiddenException('Not your booking');
            }
        }
        if (booking.status === client_1.BookingStatus.completed || booking.status === client_1.BookingStatus.cancelled || booking.status === client_1.BookingStatus.active) {
            throw new common_1.BadRequestException(`Cannot cancel a booking that is ${booking.status}`);
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: client_1.BookingStatus.cancelled,
                cancelledAt: new Date(),
            },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'BOOKING_CANCELLED',
            entityType: 'Booking',
            entityId: booking.id,
        });
        return updated;
    }
    async markActive(hostUserId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
        if (booking.vehicle.hostId !== hostProfile?.id) {
            throw new common_1.ForbiddenException('Not your booking');
        }
        if (booking.status !== client_1.BookingStatus.paid) {
            throw new common_1.BadRequestException(`Booking must be paid before it can be active (current: ${booking.status})`);
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: client_1.BookingStatus.active,
                startedAt: new Date(),
            },
        });
        await this.auditLogService.logAction({
            actorId: hostUserId,
            action: 'BOOKING_MARKED_ACTIVE',
            entityType: 'Booking',
            entityId: booking.id,
        });
        return updated;
    }
    async completeBooking(hostUserId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
        if (booking.vehicle.hostId !== hostProfile?.id) {
            throw new common_1.ForbiddenException('Not your booking');
        }
        if (booking.status !== client_1.BookingStatus.active) {
            throw new common_1.BadRequestException(`Booking must be active before it can be completed (current: ${booking.status})`);
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: client_1.BookingStatus.completed,
                completedAt: new Date(),
            },
        });
        await this.auditLogService.logAction({
            actorId: hostUserId,
            action: 'BOOKING_COMPLETED',
            entityType: 'Booking',
            entityId: booking.id,
        });
        return updated;
    }
    async getRenterBookings(renterId) {
        return this.prisma.booking.findMany({
            where: { renterId },
            include: { vehicle: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getHostBookings(userId) {
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        if (!hostProfile)
            return [];
        return this.prisma.booking.findMany({
            where: { hostId: hostProfile.id },
            include: { vehicle: true, renter: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getBookingById(userId, bookingId, role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true, payments: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (role === 'renter' && booking.renterId !== userId) {
            throw new common_1.ForbiddenException('Not your booking');
        }
        if (role === 'host') {
            const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
            if (booking.vehicle.hostId !== hostProfile?.id) {
                throw new common_1.ForbiddenException('Not your booking');
            }
        }
        return booking;
    }
    async extendBooking(userId, bookingId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.renterId !== userId)
            throw new common_1.ForbiddenException('Not your booking');
        if (booking.status !== client_1.BookingStatus.active && booking.status !== client_1.BookingStatus.paid && booking.status !== client_1.BookingStatus.confirmed) {
            throw new common_1.BadRequestException(`Cannot extend a booking that is ${booking.status}`);
        }
        const newEndDate = (0, date_fns_1.endOfDay)(new Date(dto.newEndDate));
        if (newEndDate <= booking.endDate) {
            throw new common_1.BadRequestException('New end date must be after the current end date');
        }
        const overlaps = await this.prisma.booking.findFirst({
            where: {
                id: { not: booking.id },
                vehicleId: booking.vehicleId,
                status: { in: [client_1.BookingStatus.confirmed, client_1.BookingStatus.paid, client_1.BookingStatus.active] },
                OR: [
                    { startDate: { lte: newEndDate }, endDate: { gt: booking.endDate } },
                ],
            },
        });
        if (overlaps) {
            throw new common_1.BadRequestException('Vehicle is not available for the extended dates');
        }
        const newDaysCount = (0, date_fns_1.differenceInDays)(newEndDate, booking.startDate) + 1;
        const baseAmount = booking.vehicle.dailyRate * newDaysCount;
        const platformFeeAmount = baseAmount * this.PLATFORM_FEE_PERCENTAGE;
        const securityDepositAmount = booking.vehicle.securityDeposit;
        const totalAmount = baseAmount + platformFeeAmount + securityDepositAmount;
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                endDate: newEndDate,
                daysCount: newDaysCount,
                baseAmount,
                platformFeeAmount,
                totalAmount,
            },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'BOOKING_EXTENDED',
            entityType: 'Booking',
            entityId: booking.id,
            afterJson: { newEndDate: updated.endDate },
        });
        return updated;
    }
    async disputeBooking(userId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
        const isParticipant = booking.renterId === userId || booking.vehicle.hostId === hostProfile?.id;
        if (!isParticipant) {
            throw new common_1.ForbiddenException('Not authorized to dispute this booking');
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: client_1.BookingStatus.disputed },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'BOOKING_DISPUTED',
            entityType: 'Booking',
            entityId: bookingId,
        });
        return updated;
    }
    async refundBooking(adminId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const updated = await this.prisma.$transaction(async (tx) => {
            const b = await tx.booking.update({
                where: { id: bookingId },
                data: { status: client_1.BookingStatus.cancelled, paymentStatus: 'refunded' },
            });
            await tx.payment.updateMany({
                where: { bookingId, status: 'success' },
                data: { status: 'refunded' },
            });
            return b;
        });
        await this.auditLogService.logAction({
            actorId: adminId,
            action: 'BOOKING_REFUNDED_BY_ADMIN',
            entityType: 'Booking',
            entityId: bookingId,
        });
        return updated;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map