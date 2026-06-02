import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { SubmitRenterKycDto, SubmitHostKycDto, ReviewKycDto } from './dto/kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PolicyGuard } from '../common/guards/policy.guard';
import { RequireActiveStatus } from '../common/policies/policies.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('KYC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PolicyGuard, RolesGuard)
@RequireActiveStatus()
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('renter')
  @Roles(Role.renter)
  @ApiOperation({ summary: 'Submit renter KYC (Renter only)' })
  async submitRenterKyc(@CurrentUser() user: any, @Body() dto: SubmitRenterKycDto) {
    const data = await this.kycService.submitRenterKyc(user.id, dto);
    return {
      message: 'Renter KYC submitted successfully',
      data,
    };
  }

  @Post('host')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Submit host KYC (Host only)' })
  async submitHostKyc(@CurrentUser() user: any, @Body() dto: SubmitHostKycDto) {
    const data = await this.kycService.submitHostKyc(user.id, dto);
    return {
      message: 'Host KYC submitted successfully',
      data,
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user KYC submissions' })
  async getMyKyc(@CurrentUser() user: any) {
    const data = await this.kycService.getMyKyc(user.id);
    return {
      message: 'KYC submissions fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get KYC submission by ID (Admin only)' })
  async getKycById(@Param('id') id: string) {
    const data = await this.kycService.getKycById(id);
    return {
      message: 'KYC submission fetched successfully',
      data,
    };
  }

  @Patch(':id/approve')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Approve KYC submission (Admin only)' })
  async approveKyc(@Param('id') id: string, @CurrentUser() admin: any, @Body() dto: ReviewKycDto) {
    const data = await this.kycService.approveKyc(id, admin.id, dto);
    return {
      message: 'KYC approved successfully',
      data,
    };
  }

  @Patch(':id/reject')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Reject KYC submission (Admin only)' })
  async rejectKyc(@Param('id') id: string, @CurrentUser() admin: any, @Body() dto: ReviewKycDto) {
    const data = await this.kycService.rejectKyc(id, admin.id, dto);
    return {
      message: 'KYC rejected successfully',
      data,
    };
  }
}
