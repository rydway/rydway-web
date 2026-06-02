import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchVehiclesDto {
  @ApiProperty({ required: false, example: 'Abuja' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false, description: 'Radius in km' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  radius?: number;

  @ApiProperty({ required: false, example: '2026-06-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, example: '2026-06-05T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, example: 'suv' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  priceMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  priceMax?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  seats?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fuelType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  verifiedOnly?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featuredOnly?: boolean;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit?: number = 20;
}
