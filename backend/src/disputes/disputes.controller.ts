import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { RaiseDisputeDto, ResolveDisputeDto } from './dto/disputes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, DisputeStatus } from '@prisma/client';

@ApiTags('Disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @Roles(Role.renter, Role.host)
  @ApiOperation({ summary: 'Raise a dispute on a completed booking (Renter/Host)' })
  async raiseDispute(@CurrentUser() user: any, @Body() dto: RaiseDisputeDto) {
    const data = await this.disputesService.raiseDispute(user.id, dto);
    return {
      message: 'Dispute raised successfully. An admin will review within 48 hours.',
      data,
    };
  }

  @Get('me')
  @Roles(Role.renter, Role.host)
  @ApiOperation({ summary: 'Get my disputes (Renter/Host)' })
  async getMyDisputes(@CurrentUser() user: any) {
    const data = await this.disputesService.getMyDisputes(user.id);
    return {
      message: 'Disputes fetched successfully',
      data,
    };
  }

  @Get()
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get all disputes — optionally filter by status (Admin only)' })
  async getAllDisputes(@Query('status') status?: DisputeStatus) {
    const data = await this.disputesService.getAllDisputes(status);
    return {
      message: 'All disputes fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get dispute by ID with full inspection evidence (Admin only)' })
  async getDisputeById(@Param('id') id: string) {
    const data = await this.disputesService.getDisputeById(id);
    return {
      message: 'Dispute fetched successfully',
      data,
    };
  }

  @Patch(':id/resolve')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Resolve or reject a dispute (Admin only)' })
  async resolveDispute(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ) {
    const data = await this.disputesService.resolveDispute(admin.id, id, dto);
    return {
      message: `Dispute ${dto.outcome === 'RESOLVED' ? 'resolved' : 'rejected'} successfully`,
      data,
    };
  }
}
