import { Controller, Patch, Param, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Controller('admin/vehicles')
export class AdminVehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify vehicle (Admin only)' })
  async verifyVehicle(@CurrentUser() admin: any, @Param('id') id: string) {
    const data = await this.vehiclesService.verifyVehicle(admin.id, id, true);
    return {
      message: 'Vehicle verified successfully',
      data,
    };
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject vehicle (Admin only)' })
  async rejectVehicle(@CurrentUser() admin: any, @Param('id') id: string) {
    const data = await this.vehiclesService.verifyVehicle(admin.id, id, false);
    return {
      message: 'Vehicle rejected successfully',
      data,
    };
  }
}
