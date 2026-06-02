import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMaintenanceLogDto {
  @ApiProperty({ example: 'Oil change and tire rotation' })
  @IsString() @IsNotEmpty() title: string;

  @ApiProperty({ required: false, example: 'Routine service at 50,000km' })
  @IsOptional() @IsString() description?: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString() maintenanceDate: string;

  @ApiProperty({ required: false, example: 25000 })
  @IsOptional() @IsNumber() cost?: number;
}
