import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInspectionDto } from './dto/inspections.dto';
import { InspectionType } from '@prisma/client';

@Injectable()
export class InspectionsService {
  constructor(private prisma: PrismaService) {}

  async createInspection(userId: string, dto: CreateInspectionDto) {
    // Verify booking exists and user is a participant
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        renter: { select: { id: true } },
        hostProfile: { select: { userId: true } },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isRenter = booking.renterId === userId;
    const isHost = booking.hostProfile?.userId === userId;

    if (!isRenter && !isHost) {
      throw new ForbiddenException('You are not a participant in this booking');
    }

    // Validate required status for each inspection type
    if (dto.type === InspectionType.PRE && booking.status !== 'confirmed' && booking.status !== 'paid') {
      throw new BadRequestException(
        `PRE inspection can only be submitted for confirmed or paid bookings (current: ${booking.status})`,
      );
    }

    if (dto.type === InspectionType.POST && booking.status !== 'active') {
      throw new BadRequestException(
        `POST inspection can only be submitted for active bookings (current: ${booking.status})`,
      );
    }

    if (dto.photoUrls.length < 4) {
      throw new BadRequestException('At least 4 inspection photos are required');
    }

    // Upsert — if PRE or POST already exists, reject
    const existing = await this.prisma.tripInspection.findUnique({
      where: { bookingId_type: { bookingId: dto.bookingId, type: dto.type } },
    });

    if (existing) {
      throw new BadRequestException(
        `A ${dto.type} inspection has already been submitted for this booking`,
      );
    }

    const inspection = await this.prisma.tripInspection.create({
      data: {
        bookingId: dto.bookingId,
        type: dto.type,
        photoUrls: dto.photoUrls,
      },
    });

    return inspection;
  }

  async getInspectionsForBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { hostProfile: { select: { userId: true } } },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isRenter = booking.renterId === userId;
    const isHost = booking.hostProfile?.userId === userId;

    if (!isRenter && !isHost) {
      throw new ForbiddenException('You are not a participant in this booking');
    }

    return this.prisma.tripInspection.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllInspections(bookingId?: string) {
    return this.prisma.tripInspection.findMany({
      where: bookingId ? { bookingId } : undefined,
      include: {
        booking: { select: { bookingNumber: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
