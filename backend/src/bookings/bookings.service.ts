import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateBookingDto, ExtendBookingDto } from './dto/bookings.dto';
import { BookingStatus, VehicleStatus, KycStatus } from '@prisma/client';
import { differenceInDays, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class BookingsService {
  private readonly PLATFORM_FEE_PERCENTAGE = 0.10; // 10%

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
  ) {}

  private generateBookingNumber(): string {
    return 'BKG-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }

  async createBooking(renterId: string, dto: CreateBookingDto) {
    const renter = await this.prisma.user.findUnique({ where: { id: renterId } });
    if (!renter) {
      throw new NotFoundException('Renter not found');
    }
    if (renter.kycStatus !== KycStatus.verified) {
      throw new ForbiddenException('You must complete KYC verification before booking a vehicle');
    }

    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: dto.vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (vehicle.status === VehicleStatus.archived || vehicle.status === VehicleStatus.maintenance) {
      throw new BadRequestException('Vehicle is not available for booking');
    }

    const startDate = startOfDay(new Date(dto.startDate));
    const endDate = endOfDay(new Date(dto.endDate));

    if (startDate < startOfDay(new Date())) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    let daysCount = differenceInDays(endDate, startDate) + 1;
    if (daysCount < vehicle.minimumRentalDays) {
      throw new BadRequestException(`Minimum rental days for this vehicle is ${vehicle.minimumRentalDays}`);
    }

    // Locking with Redis
    const lockKey = `booking:lock:${vehicle.id}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const acquired = await this.redisService.setnx(lockKey, '1');
    if (!acquired) {
      throw new BadRequestException('This vehicle is currently being booked for these dates. Please try again later.');
    }
    await this.redisService.expire(lockKey, 60); // 60 seconds lock

    try {
      // Check overlaps in DB
      const overlaps = await this.prisma.booking.findFirst({
        where: {
          vehicleId: vehicle.id,
          status: { in: [BookingStatus.confirmed, BookingStatus.paid, BookingStatus.active] },
          OR: [
            { startDate: { lte: endDate }, endDate: { gte: startDate } },
          ],
        },
      });

      if (overlaps) {
        throw new BadRequestException('Vehicle is not available for the selected dates');
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
          status: BookingStatus.requested,
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
    } finally {
      await this.redisService.del(lockKey);
    }
  }

  async approveBooking(hostUserId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
    if (booking.vehicle.hostId !== hostProfile?.id) {
      throw new ForbiddenException('You do not own the vehicle for this booking');
    }

    if (booking.status !== BookingStatus.requested) {
      throw new BadRequestException(`Cannot approve booking in ${booking.status} status`);
    }

    // Double check overlaps before confirming
    const overlaps = await this.prisma.booking.findFirst({
      where: {
        id: { not: booking.id },
        vehicleId: booking.vehicleId,
        status: { in: [BookingStatus.confirmed, BookingStatus.paid, BookingStatus.active] },
        OR: [
          { startDate: { lte: booking.endDate }, endDate: { gte: booking.startDate } },
        ],
      },
    });

    if (overlaps) {
      // Auto-decline the booking if there is now an overlap
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.cancelled, approvalStatus: 'declined_due_to_conflict' },
      });
      throw new BadRequestException('This booking overlaps with an already confirmed booking and has been auto-declined.');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.confirmed,
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

  async declineBooking(hostUserId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
    if (booking.vehicle.hostId !== hostProfile?.id) {
      throw new ForbiddenException('You do not own the vehicle for this booking');
    }

    if (booking.status !== BookingStatus.requested) {
      throw new BadRequestException(`Cannot decline booking in ${booking.status} status`);
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.cancelled,
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

  async cancelBooking(userId: string, bookingId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (role === 'renter' && booking.renterId !== userId) {
      throw new ForbiddenException('Not your booking');
    }

    if (role === 'host') {
      const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
      if (booking.vehicle.hostId !== hostProfile?.id) {
        throw new ForbiddenException('Not your booking');
      }
    }

    if (booking.status === BookingStatus.completed || booking.status === BookingStatus.cancelled || booking.status === BookingStatus.active) {
      throw new BadRequestException(`Cannot cancel a booking that is ${booking.status}`);
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.cancelled,
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

  async markActive(hostUserId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
    if (booking.vehicle.hostId !== hostProfile?.id) {
      throw new ForbiddenException('Not your booking');
    }

    if (booking.status !== BookingStatus.paid) {
      throw new BadRequestException(`Booking must be paid before it can be active (current: ${booking.status})`);
    }

    const preInspection = await this.prisma.tripInspection.findUnique({
      where: { bookingId_type: { bookingId, type: 'PRE' } },
    });
    if (!preInspection) {
      throw new BadRequestException('Pre-trip inspection photos must be uploaded before starting the trip');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.active,
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

  async completeBooking(hostUserId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
    if (booking.vehicle.hostId !== hostProfile?.id) {
      throw new ForbiddenException('Not your booking');
    }

    if (booking.status !== BookingStatus.active) {
      throw new BadRequestException(`Booking must be active before it can be completed (current: ${booking.status})`);
    }

    const postInspection = await this.prisma.tripInspection.findUnique({
      where: { bookingId_type: { bookingId, type: 'POST' } },
    });
    if (!postInspection) {
      throw new BadRequestException('Post-trip inspection photos must be uploaded before completing the trip');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.completed,
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

  async getRenterBookings(renterId: string) {
    return this.prisma.booking.findMany({
      where: { renterId },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHostBookings(userId: string) {
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    if (!hostProfile) return [];

    return this.prisma.booking.findMany({
      where: { hostId: hostProfile.id },
      include: { vehicle: true, renter: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(userId: string, bookingId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, payments: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (role === 'renter' && booking.renterId !== userId) {
      throw new ForbiddenException('Not your booking');
    }

    if (role === 'host') {
      const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
      if (booking.vehicle.hostId !== hostProfile?.id) {
        throw new ForbiddenException('Not your booking');
      }
    }

    return booking;
  }

  async extendBooking(userId: string, bookingId: string, dto: ExtendBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId) throw new ForbiddenException('Not your booking');

    if (booking.status !== BookingStatus.active && booking.status !== BookingStatus.paid && booking.status !== BookingStatus.confirmed) {
      throw new BadRequestException(`Cannot extend a booking that is ${booking.status}`);
    }

    const newEndDate = endOfDay(new Date(dto.newEndDate));
    if (newEndDate <= booking.endDate) {
      throw new BadRequestException('New end date must be after the current end date');
    }

    // Check overlaps for the extension period only
    const overlaps = await this.prisma.booking.findFirst({
      where: {
        id: { not: booking.id },
        vehicleId: booking.vehicleId,
        status: { in: [BookingStatus.confirmed, BookingStatus.paid, BookingStatus.active] },
        OR: [
          { startDate: { lte: newEndDate }, endDate: { gt: booking.endDate } },
        ],
      },
    });

    if (overlaps) {
      throw new BadRequestException('Vehicle is not available for the extended dates');
    }

    const newDaysCount = differenceInDays(newEndDate, booking.startDate) + 1;
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
        // we keep the same securityDepositAmount usually
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

  async disputeBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId } });
    const isParticipant = booking.renterId === userId || booking.vehicle.hostId === hostProfile?.id;
    if (!isParticipant) {
      throw new ForbiddenException('Not authorized to dispute this booking');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.disputed },
    });

    await this.auditLogService.logAction({
      actorId: userId,
      action: 'BOOKING_DISPUTED',
      entityType: 'Booking',
      entityId: bookingId,
    });

    return updated;
  }

  async refundBooking(adminId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.cancelled, paymentStatus: 'refunded' },
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
}

