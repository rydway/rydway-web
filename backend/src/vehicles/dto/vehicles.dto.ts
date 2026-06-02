import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsEnum, Min, IsUrl } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota Camry 2022' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sedan' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'petrol' })
  @IsString()
  @IsNotEmpty()
  fuelType: string;

  @ApiProperty({ example: 'automatic' })
  @IsString()
  @IsNotEmpty()
  transmission: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  seats: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  dailyRate: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  securityDeposit: number;

  @ApiProperty({ example: 'Abuja, FCT' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 9.0765, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 7.3986, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 'Well maintained luxury sedan.', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  requiresDriver?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minimumRentalDays?: number;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

export class UpdateVehicleStatusDto {
  @ApiProperty({ enum: VehicleStatus })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}

export class AddVehicleMediaDto {
  @ApiProperty({ example: 'https://storage.supabase.co/xyz/car-front.jpg' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
