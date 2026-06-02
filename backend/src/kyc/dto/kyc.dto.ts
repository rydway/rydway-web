import { IsString, IsNotEmpty, IsOptional, IsUrl, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitRenterKycDto {
  @ApiProperty({ example: 'ABC1234567' })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ example: '2030-01-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  licenseExpiry: string;

  @ApiProperty({ example: 'https://storage.supabase.co/xyz/license.pdf' })
  @IsUrl()
  @IsNotEmpty()
  licenseDocumentUrl: string;

  @ApiProperty({ example: 'https://storage.supabase.co/xyz/selfie.jpg' })
  @IsUrl()
  @IsNotEmpty()
  selfieUrl: string;
}

export class SubmitHostKycDto {
  @ApiProperty({ example: 'Rydway Rentals Ltd' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'RC123456' })
  @IsString()
  @IsNotEmpty()
  cacNumber: string;

  @ApiProperty({ example: '12345678-0001' })
  @IsString()
  @IsNotEmpty()
  taxId: string;

  @ApiProperty({ example: 'https://storage.supabase.co/xyz/cac.pdf' })
  @IsUrl()
  @IsNotEmpty()
  cacDocumentUrl: string;

  @ApiProperty({ example: 'GTBank' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: 'Rydway Rentals Ltd' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}

export class ReviewKycDto {
  @ApiProperty({ required: false, example: 'All documents valid' })
  @IsString()
  @IsOptional()
  reviewNotes?: string;
}
