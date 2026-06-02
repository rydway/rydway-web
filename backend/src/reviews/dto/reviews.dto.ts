import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleReviewDto {
  @ApiProperty({ example: 'uuid-booking-id' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great car, very clean and well maintained.' })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateHostReviewDto {
  @ApiProperty({ example: 'uuid-booking-id' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  hostRating: number;

  @ApiProperty({ example: 'Very responsive and helpful host.', required: false })
  @IsOptional()
  @IsString()
  hostComment?: string;
}

export class CreateRenterReviewDto {
  @ApiProperty({ example: 'uuid-booking-id' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  renterRating: number;

  @ApiProperty({ example: 'Excellent renter, returned the car in perfect condition.', required: false })
  @IsOptional()
  @IsString()
  renterComment?: string;
}
