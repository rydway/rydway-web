import { Controller, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { MarkPayoutPaidDto } from './dto/payouts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Payouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Controller('payouts')
export class AdminPayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payouts (Admin only)' })
  @ApiQuery({ name: 'status', required: false })
  async getAllPayouts(@Query('status') status?: string) {
    const data = await this.payoutsService.getAllPayouts(status);
    return {
      message: 'Payouts fetched successfully',
      data,
    };
  }

  @Patch(':id/mark-paid')
  @ApiOperation({ summary: 'Mark payout as paid (Admin only)' })
  async markPayoutPaid(@CurrentUser() admin: any, @Param('id') id: string, @Body() dto: MarkPayoutPaidDto) {
    const data = await this.payoutsService.markPayoutPaid(admin.id, id, dto.transactionRef);
    return {
      message: 'Payout marked as paid',
      data,
    };
  }
}
