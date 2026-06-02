import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RaiseDisputeDto {
  @ApiProperty({ example: 'uuid-booking-id' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 'Car returned with damage not present during PRE inspection.' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ResolveDisputeDto {
  @ApiProperty({ example: 'Damage confirmed via POST inspection. Deposit retained.' })
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @ApiProperty({ enum: ['RESOLVED', 'REJECTED'], example: 'RESOLVED' })
  @IsString()
  @IsNotEmpty()
  outcome: 'RESOLVED' | 'REJECTED';
}
