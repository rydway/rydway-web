import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawEarningsDto {
  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(1000) // Minimum withdrawal limit
  amount: string;
}

export class MarkPayoutPaidDto {
  @ApiProperty({ example: 'tx-ref-456', required: false })
  @IsString()
  transactionRef?: string;
}
