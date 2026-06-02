import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/inspections.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Inspections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  @Roles(Role.renter, Role.host)
  @ApiOperation({ summary: 'Submit a PRE or POST trip inspection (Renter/Host)' })
  async createInspection(@CurrentUser() user: any, @Body() dto: CreateInspectionDto) {
    const data = await this.inspectionsService.createInspection(user.id, dto);
    return {
      message: 'Inspection submitted successfully',
      data,
    };
  }

  @Get('booking/:bookingId')
  @Roles(Role.renter, Role.host)
  @ApiOperation({ summary: 'Get all inspections for a specific booking' })
  async getInspectionsForBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
  ) {
    const data = await this.inspectionsService.getInspectionsForBooking(user.id, bookingId);
    return {
      message: 'Inspections fetched successfully',
      data,
    };
  }

  @Get()
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get all inspections — optionally filter by bookingId (Admin only)' })
  async getAllInspections(@Query('bookingId') bookingId?: string) {
    const data = await this.inspectionsService.getAllInspections(bookingId);
    return {
      message: 'All inspections fetched successfully',
      data,
    };
  }
}
