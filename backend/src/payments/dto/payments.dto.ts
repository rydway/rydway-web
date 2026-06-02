import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializePaymentDto {
  @ApiProperty({ example: 'uuid-booking-id' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 'paystack' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 'card' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ example: 'tx-ref-123' })
  @IsString()
  @IsNotEmpty()
  transactionRef: string;
}

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'card' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'tok_12345' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: '**** **** **** 4242', required: false })
  @IsOptional()
  @IsString()
  last4?: string;
}
