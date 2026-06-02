import { IsString, IsNotEmpty, IsEnum, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InspectionType } from '@prisma/client';

export class CreateInspectionDto {
  @ApiProperty({ example: 'uuid-booking-id' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ enum: InspectionType, example: InspectionType.PRE })
  @IsEnum(InspectionType)
  type: InspectionType;

  @ApiProperty({ type: [String], example: ['https://storage.supabase.co/...'] })
  @IsArray()
  @IsUrl({}, { each: true })
  photoUrls: string[];
}
