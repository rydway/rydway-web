import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateVehicleReviewDto, CreateHostReviewDto, CreateRenterReviewDto } from './dto/reviews.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  private async getCompletedBookingForRenter(renterId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== renterId) throw new ForbiddenException('Not your booking');
    if (booking.status !== BookingStatus.completed) {
      throw new BadRequestException('You can only review completed bookings');
    }

    return booking;
  }

  async createVehicleReview(renterId: string, dto: CreateVehicleReviewDto) {
    const booking = await this.getCompletedBookingForRenter(renterId, dto.bookingId);

    // Check not already reviewed
    const existing = await this.prisma.review.findFirst({
      where: { bookingId: dto.bookingId, type: 'vehicle' },
    });
    if (existing) throw new BadRequestException('You have already reviewed this booking');

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

      // Recalculate vehicle average rating
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

  async createHostReview(renterId: string, dto: CreateHostReviewDto) {
    const booking = await this.getCompletedBookingForRenter(renterId, dto.bookingId);

    const existing = await this.prisma.review.findFirst({
      where: { bookingId: dto.bookingId, type: 'host' },
    });
    if (existing) throw new BadRequestException('You have already reviewed this host for this booking');

    const hostProfile = await this.prisma.hostProfile.findUnique({
      where: { id: booking.vehicle.hostId },
    });
    if (!hostProfile) throw new NotFoundException('Host profile not found');

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

      // Recalculate host avg rating
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

  async createRenterReview(hostUserId: string, dto: CreateRenterReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== BookingStatus.completed) {
      throw new BadRequestException('You can only review completed bookings');
    }

    // Verify host owns the vehicle
    const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: hostUserId } });
    if (!hostProfile || booking.vehicle.hostId !== hostProfile.id) {
      throw new ForbiddenException('Not your booking to review');
    }

    const existing = await this.prisma.review.findFirst({
      where: { bookingId: dto.bookingId, type: 'renter' },
    });
    if (existing) throw new BadRequestException('You have already reviewed this renter for this booking');

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

      // Recalculate renter avg rating on their profile
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

  async getVehicleReviews(vehicleId: string, page = 1, limit = 10) {
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

  async getHostReviews(hostUserId: string, page = 1, limit = 10) {
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

  async getMyReceivedReviews(userId: string, page = 1, limit = 10) {
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
}
