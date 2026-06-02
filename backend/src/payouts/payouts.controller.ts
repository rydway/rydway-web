import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Payouts')
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Webhook endpoint for payout providers (e.g. Paystack Transfers)' })
  async handleWebhook(@Req() req: any, @Body() payload: any) {
    const provider = req.headers['x-provider-name'] || 'paystack';
    await this.payoutsService.handleWebhook(provider, payload);
    return { success: true };
  }
}
