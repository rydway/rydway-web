import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('renter/summary')
  @Roles(Role.renter)
  @ApiOperation({ summary: 'Get renter dashboard summary' })
  async getRenterSummary(@CurrentUser() user: any) {
    const data = await this.dashboardService.getRenterSummary(user.id);
    return { message: 'Renter dashboard fetched successfully', data };
  }

  @Get('host/summary')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Get host dashboard summary' })
  async getHostSummary(@CurrentUser() user: any) {
    const data = await this.dashboardService.getHostSummary(user.id);
    return { message: 'Host dashboard fetched successfully', data };
  }
}
