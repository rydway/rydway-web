import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * BookingOwnershipGuard — ensures the requesting user is a participant in the booking.
 * Works for both renters (renterId) and hosts (via their hostProfile.id).
 * Expects the booking ID in route params as :id or :bookingId.
 */
@Injectable()
export class BookingOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const bookingId = request.params.id || request.params.bookingId;

    if (!user) throw new ForbiddenException('Authentication required');
    if (!bookingId) return true; // No booking in scope — let route handle it

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: { select: { hostId: true } } },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isRenter = booking.renterId === user.id;

    let isHost = false;
    if (user.role === 'host') {
      const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: user.id } });
      isHost = hostProfile?.id === booking.vehicle.hostId;
    }

    const isAdmin = user.role === 'admin';

    if (!isRenter && !isHost && !isAdmin) {
      throw new ForbiddenException({
        message: 'You do not have access to this booking',
        error: { code: 'FORBIDDEN' },
      });
    }

    // Attach booking to request for downstream use
    request.booking = booking;
    return true;
  }
}
