import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBookingDto } from './dto/bookings.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.renter)
  @ApiOperation({ summary: 'Create a new booking' })
  async createBooking(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    const data = await this.bookingsService.createBooking(user.id, dto);
    return {
      message: 'Booking created successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details (participants only)' })
  async getBookingById(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.getBookingById(user.id, id, user.role);
    return {
      message: 'Booking fetched successfully',
      data,
    };
  }

  @Patch(':id/approve')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Approve a booking' })
  async approveBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.approveBooking(user.id, id);
    return {
      message: 'Booking approved successfully',
      data,
    };
  }

  @Patch(':id/decline')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Decline a booking' })
  async declineBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.declineBooking(user.id, id);
    return {
      message: 'Booking declined successfully',
      data,
    };
  }

  @Post(':id/mark-active')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Mark booking as active (trip started)' })
  async markActive(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.markActive(user.id, id);
    return {
      message: 'Booking marked as active',
      data,
    };
  }

  @Post(':id/complete')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Mark booking as completed (trip ended)' })
  async completeBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.completeBooking(user.id, id);
    return {
      message: 'Booking marked as completed',
      data,
    };
  }

  @Post(':id/dispute')
  @Roles(Role.renter, Role.host)
  @ApiOperation({ summary: 'Dispute a booking' })
  async disputeBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.disputeBooking(user.id, id);
    return {
      message: 'Booking disputed successfully',
      data,
    };
  }

  @Post(':id/refund')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Refund a booking (Admin only)' })
  async refundBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.refundBooking(user.id, id);
    return {
      message: 'Booking refunded successfully',
      data,
    };
  }
}

