import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PolicyGuard } from '../common/guards/policy.guard';
import { RequireActiveStatus } from '../common/policies/policies.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBookingDto, ExtendBookingDto } from './dto/bookings.dto';

@ApiTags('Renter Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PolicyGuard, RolesGuard)
@Roles(Role.renter)
@RequireActiveStatus()
@Controller('renter/bookings')
export class RenterBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all renter bookings' })
  async getRenterBookings(@CurrentUser() user: any) {
    const data = await this.bookingsService.getRenterBookings(user.id);
    return {
      message: 'Bookings fetched successfully',
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async createBooking(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    const data = await this.bookingsService.createBooking(user.id, dto);
    return {
      message: 'Booking created successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get renter booking details' })
  async getBookingById(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.getBookingById(user.id, id, user.role);
    return {
      message: 'Booking fetched successfully',
      data,
    };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  async cancelBooking(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.bookingsService.cancelBooking(user.id, id, user.role);
    return {
      message: 'Booking cancelled successfully',
      data,
    };
  }

  @Post(':id/extend')
  @ApiOperation({ summary: 'Extend a booking' })
  async extendBooking(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: ExtendBookingDto) {
    const data = await this.bookingsService.extendBooking(user.id, id, dto);
    return {
      message: 'Booking extended successfully',
      data,
    };
  }
}
