import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { WithdrawEarningsDto } from './dto/payouts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Host Fleet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.host)
@Controller('host/earnings')
export class HostEarningsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get host earnings summary' })
  async getSummary(@CurrentUser() user: any) {
    const data = await this.payoutsService.getHostEarningsSummary(user.id);
    return {
      message: 'Earnings summary fetched successfully',
      data,
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get host payout transactions' })
  async getTransactions(@CurrentUser() user: any) {
    const data = await this.payoutsService.getHostTransactions(user.id);
    return {
      message: 'Transactions fetched successfully',
      data,
    };
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request a withdrawal of earnings' })
  async withdraw(@CurrentUser() user: any, @Body() dto: WithdrawEarningsDto) {
    const amount = parseFloat(dto.amount);
    const data = await this.payoutsService.requestWithdrawal(user.id, amount);
    return {
      message: 'Withdrawal requested successfully',
      data,
    };
  }
}
