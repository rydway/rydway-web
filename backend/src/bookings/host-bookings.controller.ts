import { Controller, Get, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PolicyGuard } from '../common/guards/policy.guard';
import { RequireActiveStatus } from '../common/policies/policies.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Host Fleet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PolicyGuard, RolesGuard)
@Roles(Role.host)
@RequireActiveStatus()
@Controller('host/bookings')
export class HostBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all host bookings' })
  async getHostBookings(@CurrentUser() user: any) {
    const data = await this.bookingsService.getHostBookings(user.id);
    return {
      message: 'Bookings fetched successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get host booking details' })
  async getBookingById(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.getBookingById(user.id, id, user.role);
    return {
      message: 'Booking fetched successfully',
      data,
    };
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a booking' })
  async approveBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.approveBooking(user.id, id);
    return {
      message: 'Booking approved successfully',
      data,
    };
  }

  @Patch(':id/decline')
  @ApiOperation({ summary: 'Decline a booking' })
  async declineBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.declineBooking(user.id, id);
    return {
      message: 'Booking declined successfully',
      data,
    };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking as host' })
  async cancelBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.cancelBooking(user.id, id, user.role);
    return {
      message: 'Booking cancelled successfully',
      data,
    };
  }
}
