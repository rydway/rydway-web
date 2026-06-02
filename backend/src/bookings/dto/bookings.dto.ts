import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-06-05' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: '09:00:00' })
  @IsString()
  @IsNotEmpty()
  pickupTime: string;

  @ApiProperty({ example: '18:00:00' })
  @IsString()
  @IsNotEmpty()
  dropoffTime: string;

  @ApiProperty({ example: 'Abuja Airport' })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @ApiProperty({ example: 'Abuja City Center' })
  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  @ApiProperty({ required: false, example: { insurance: true, driver: false } })
  @IsOptional()
  extras?: any;
}

export class ExtendBookingDto {
  @ApiProperty({ example: '2026-06-07' })
  @IsDateString()
  @IsNotEmpty()
  newEndDate: string;
}
