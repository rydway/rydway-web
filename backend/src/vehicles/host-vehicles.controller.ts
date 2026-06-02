import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PolicyGuard } from '../common/guards/policy.guard';
import { RequireActiveStatus } from '../common/policies/policies.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CreateVehicleDto, UpdateVehicleDto, UpdateVehicleStatusDto, AddVehicleMediaDto } from './dto/vehicles.dto';
import { AddMaintenanceLogDto } from './dto/maintenance.dto';

@ApiTags('Host Fleet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PolicyGuard, RolesGuard)
@Roles(Role.host)
@RequireActiveStatus()
@Controller('host/vehicles')
export class HostVehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get host vehicles' })
  async getMyVehicles(@CurrentUser() user: any) {
    const data = await this.vehiclesService.getHostVehicles(user.id);
    return {
      message: 'Vehicles fetched successfully',
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new vehicle' })
  async createVehicle(@CurrentUser() user: any, @Body() dto: CreateVehicleDto) {
    const data = await this.vehiclesService.createVehicle(user.id, dto);
    return {
      message: 'Vehicle created successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get host vehicle details' })
  async getVehicleById(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.vehiclesService.getVehicleById(id);
    return {
      message: 'Vehicle fetched successfully',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle details' })
  async updateVehicle(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    const data = await this.vehiclesService.updateVehicle(user.id, id, dto);
    return {
      message: 'Vehicle updated successfully',
      data,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vehicle status' })
  async updateVehicleStatus(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateVehicleStatusDto) {
    const data = await this.vehiclesService.updateVehicleStatus(user.id, id, dto);
    return {
      message: 'Vehicle status updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete vehicle' })
  async deleteVehicle(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.vehiclesService.deleteVehicle(user.id, id);
    return {
      message: 'Vehicle deleted successfully',
      data,
    };
  }

  @Post(':id/media')
  @ApiOperation({ summary: 'Add vehicle media' })
  async addVehicleMedia(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: AddVehicleMediaDto) {
    const data = await this.vehiclesService.addVehicleMedia(user.id, id, dto);
    return {
      message: 'Media added successfully',
      data,
    };
  }

  @Delete(':id/media/:mediaId')
  @ApiOperation({ summary: 'Remove vehicle media' })
  async removeVehicleMedia(@CurrentUser() user: any, @Param('id') id: string, @Param('mediaId') mediaId: string) {
    const data = await this.vehiclesService.removeVehicleMedia(user.id, id, mediaId);
    return {
      message: 'Media removed successfully',
      data,
    };
  }

  @Post(':id/maintenance')
  @ApiOperation({ summary: 'Add vehicle maintenance log' })
  async addMaintenanceLog(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: AddMaintenanceLogDto,
  ) {
    const data = await this.vehiclesService.addMaintenanceLog(user.id, id, dto);
    return {
      message: 'Maintenance log added successfully',
      data,
    };
  }
}

