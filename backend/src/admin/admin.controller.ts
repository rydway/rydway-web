import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserStatusDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get admin dashboard summary' })
  async getDashboardSummary() {
    const data = await this.adminService.getDashboardSummary();
    return { message: 'Admin dashboard fetched successfully', data };
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.adminService.getUsers(parseInt(page), parseInt(limit), role, search);
    return { message: 'Users fetched successfully', data };
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    const data = await this.adminService.getUserById(id);
    return { message: 'User fetched successfully', data };
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Activate or deactivate a user' })
  async updateUserStatus(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    const data = await this.adminService.updateUserStatus(admin.id, id, dto.isActive);
    return { message: `User ${dto.isActive ? 'activated' : 'deactivated'} successfully`, data };
  }

  // ─── KYC ─────────────────────────────────────────────────────────────────

  @Get('kyc')
  @ApiOperation({ summary: 'List all KYC submissions' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAllKyc(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    const data = await this.adminService.getAllKycSubmissions(parseInt(page), parseInt(limit), status);
    return { message: 'KYC submissions fetched successfully', data };
  }

  // ─── Vehicles ─────────────────────────────────────────────────────────────

  @Get('vehicles')
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'verified', required: false })
  async getAllVehicles(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('verified') verified?: string,
  ) {
    const verifiedBool = verified === 'true' ? true : verified === 'false' ? false : undefined;
    const data = await this.adminService.getAllVehicles(parseInt(page), parseInt(limit), verifiedBool);
    return { message: 'Vehicles fetched successfully', data };
  }

  // ─── Bookings ─────────────────────────────────────────────────────────────

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAllBookings(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    const data = await this.adminService.getAllBookings(parseInt(page), parseInt(limit), status);
    return { message: 'Bookings fetched successfully', data };
  }

  // ─── Payments ─────────────────────────────────────────────────────────────

  @Get('payments')
  @ApiOperation({ summary: 'List all payments' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAllPayments(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const data = await this.adminService.getAllPayments(parseInt(page), parseInt(limit));
    return { message: 'Payments fetched successfully', data };
  }

  // ─── Payouts ──────────────────────────────────────────────────────────────

  @Get('payouts')
  @ApiOperation({ summary: 'List all payouts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getAllPayouts(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    const data = await this.adminService.getAllPayouts(parseInt(page), parseInt(limit), status);
    return { message: 'Payouts fetched successfully', data };
  }

  // ─── Audit Logs ───────────────────────────────────────────────────────────

  @Get('audit-logs')
  @ApiOperation({ summary: 'List audit logs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'action', required: false })
  async getAuditLogs(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('action') action?: string,
  ) {
    const data = await this.adminService.getAuditLogs(parseInt(page), parseInt(limit), action);
    return { message: 'Audit logs fetched successfully', data };
  }
}
