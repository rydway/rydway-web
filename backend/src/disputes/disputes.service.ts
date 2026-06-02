import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RaiseDisputeDto, ResolveDisputeDto } from './dto/disputes.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { DisputeStatus } from '@prisma/client';

@Injectable()
export class DisputesService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async raiseDispute(userId: string, dto: RaiseDisputeDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        hostProfile: { select: { userId: true } },
        dispute: true,
        inspections: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isRenter = booking.renterId === userId;
    const isHost = booking.hostProfile?.userId === userId;

    if (!isRenter && !isHost) {
      throw new ForbiddenException('You are not a participant in this booking');
    }

    if (booking.dispute) {
      throw new BadRequestException('A dispute has already been raised for this booking');
    }

    // A dispute can only be raised on completed or active bookings
    if (!['active', 'completed', 'paid'].includes(booking.status)) {
      throw new BadRequestException(
        `Disputes can only be raised on active or completed bookings (current: ${booking.status})`,
      );
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        bookingId: dto.bookingId,
        raisedBy: userId,
        reason: dto.reason,
        status: 'OPEN',
      },
    });

    await this.auditLogService.logAction({
      actorId: userId,
      action: 'DISPUTE_RAISED',
      entityType: 'Dispute',
      entityId: dispute.id,
    });

    return dispute;
  }

  async resolveDispute(adminId: string, disputeId: string, dto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) throw new NotFoundException('Dispute not found');
    if (dispute.status !== 'OPEN') {
      throw new BadRequestException(`Dispute is already ${dispute.status}`);
    }

    const updated = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: dto.outcome,
        resolution: dto.resolution,
        resolvedAt: new Date(),
      },
    });

    await this.auditLogService.logAction({
      actorId: adminId,
      action: `DISPUTE_${dto.outcome}`,
      entityType: 'Dispute',
      entityId: disputeId,
    });

    return updated;
  }

  async getAllDisputes(status?: DisputeStatus) {
    return this.prisma.dispute.findMany({
      where: status ? { status } : undefined,
      include: {
        booking: {
          include: {
            renter: { select: { firstName: true, lastName: true, email: true } },
            hostProfile: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true } },
              },
            },
            inspections: true,
            vehicle: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: { raisedBy: userId },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            status: true,
            vehicle: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDisputeById(id: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            renter: { select: { firstName: true, lastName: true, email: true } },
            hostProfile: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            inspections: true,
            vehicle: { select: { name: true, images: { take: 1 } } },
          },
        },
      },
    });

    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }
}
