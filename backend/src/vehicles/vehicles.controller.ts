import { Controller, Get, Param, Query, Post, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get public verified vehicles' })
  async getPublicVehicles() {
    const data = await this.vehiclesService.getPublicVehicles();
    return {
      message: 'Vehicles fetched successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get public vehicle details' })
  async getVehicleById(@Param('id') id: string) {
    const data = await this.vehiclesService.getVehicleById(id);
    return {
      message: 'Vehicle fetched successfully',
      data,
    };
  }

  @Public()
  @Get(':id/calendar')
  async getCalendar(@Param('id') id: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.vehiclesService.getCalendar(id, startDate, endDate);
  }

  @Post(':id/calendar/blocks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('host')
  async addCalendarBlock(
    @Param('id') id: string,
    @Body() data: { startDate: string; endDate: string; reason?: string },
    @Request() req: any
  ) {
    return this.vehiclesService.addCalendarBlock(id, req.user.id, data);
  }

  @Delete(':id/calendar/blocks/:blockId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('host')
  async removeCalendarBlock(
    @Param('id') id: string,
    @Param('blockId') blockId: string,
    @Request() req: any
  ) {
    return this.vehiclesService.removeCalendarBlock(id, blockId, req.user.id);
  }
}
