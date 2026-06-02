import { Controller, Post, Body, Get, UseGuards, Req, Headers, type RawBodyRequest, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, VerifyPaymentDto } from './dto/payments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.renter)
  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a Paystack payment for a confirmed booking' })
  async initializePayment(
    @CurrentUser() user: any,
    @Body() dto: InitializePaymentDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const data = await this.paymentsService.initializePayment(user.id, dto, idempotencyKey);
    return {
      message: 'Payment initialized successfully',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @ApiOperation({ summary: 'Manually verify a payment by transaction reference' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    const data = await this.paymentsService.verifyPayment(dto.transactionRef);
    return {
      message: 'Payment verified successfully',
      data,
    };
  }

  /**
   * Paystack sends a POST with the raw JSON body and an X-Paystack-Signature header.
   * We must read the raw body (not parsed) to validate the HMAC-SHA512 signature.
   */
  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Paystack webhook — validates HMAC-SHA512 signature' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const rawBody = req.rawBody?.toString('utf-8') ?? JSON.stringify(req.body);
    await this.paymentsService.handleWebhook(rawBody, signature);
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  @ApiOperation({ summary: 'Get the authenticated user\'s payment transaction history' })
  async getTransactions(@CurrentUser() user: any) {
    const data = await this.paymentsService.getTransactionHistory(user.id);
    return {
      message: 'Transactions fetched successfully',
      data,
    };
  }
}
