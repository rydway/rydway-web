import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitRenterKycDto {
  @ApiPropertyOptional({ example: 'ABC1234567' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: '2030-01-01T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  licenseExpiry?: string;

  @ApiPropertyOptional({ example: 'https://storage.supabase.co/xyz/license.pdf' })
  @IsUrl()
  @IsOptional()
  licenseDocumentUrl?: string;

  @ApiProperty({ example: 'https://storage.supabase.co/xyz/selfie.jpg' })
  @IsUrl()
  @IsNotEmpty()
  selfieUrl: string;

  @ApiPropertyOptional({ example: '2000-01-01T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'Ikeja' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '123 Street Name' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+2348000000000' })
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ example: 'yes' })
  @IsString()
  @IsOptional()
  drivingChoice?: string;

  @ApiPropertyOptional({ example: 'nin' })
  @IsString()
  @IsOptional()
  identificationType?: string;

  @ApiPropertyOptional({ example: 'https://storage.supabase.co/xyz/id.jpg' })
  @IsUrl()
  @IsOptional()
  identificationDocumentUrl?: string;

  @ApiPropertyOptional({ example: 'luxury' })
  @IsString()
  @IsOptional()
  preferredCarType?: string;

  @ApiPropertyOptional({ example: 'business' })
  @IsString()
  @IsOptional()
  primaryRentalPurpose?: string;

  @ApiPropertyOptional({ example: 'frequent' })
  @IsString()
  @IsOptional()
  usageFrequency?: string;

  @ApiPropertyOptional({ example: 'short' })
  @IsString()
  @IsOptional()
  typicalTripType?: string;

  @ApiPropertyOptional({ example: 'suv' })
  @IsString()
  @IsOptional()
  vehiclePreference?: string;
}

export class SubmitHostKycDto {
  @ApiPropertyOptional({ example: 'Rydway Rentals Ltd' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({ example: 'RC123456' })
  @IsString()
  @IsOptional()
  cacNumber?: string;

  @ApiPropertyOptional({ example: '12345678-0001' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ example: 'https://storage.supabase.co/xyz/cac.pdf' })
  @IsUrl()
  @IsOptional()
  cacDocumentUrl?: string;

  @ApiPropertyOptional({ example: 'GTBank' })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional({ example: 'Rydway Rentals Ltd' })
  @IsString()
  @IsOptional()
  accountName?: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsString()
  @IsOptional()
  accountNumber?: string;

  // New optional fields for complete business information
  @ApiPropertyOptional({ example: 'Dembo Autos' })
  @IsString()
  @IsOptional()
  legalBusinessName?: string;

  @ApiPropertyOptional({ example: 'Dembo Autos' })
  @IsString()
  @IsOptional()
  tradingName?: string;

  @ApiPropertyOptional({
    enum: [
      'sole_proprietorship',
      'partnership',
      'limited_liability',
      'corporation',
    ],
  })
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiPropertyOptional({ example: 'RC234445' })
  @IsString()
  @IsOptional()
  rcNumber?: string;

  @ApiPropertyOptional({ example: '2026-06-10' })
  @IsDateString()
  @IsOptional()
  dateOfIncorporation?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  businessState?: string;

  @ApiPropertyOptional({ example: 'Ikeja' })
  @IsString()
  @IsOptional()
  businessCity?: string;

  @ApiPropertyOptional({ example: 'T20 street C Phase1' })
  @IsString()
  @IsOptional()
  businessAddress?: string;

  @ApiPropertyOptional({ example: '+2349020722091' })
  @IsString()
  @IsOptional()
  businessPhone?: string;

  @ApiPropertyOptional({ example: 'business@company.com' })
  @IsEmail()
  @IsOptional()
  businessEmail?: string;

  @ApiPropertyOptional({ example: 'TIN123456789' })
  @IsString()
  @IsOptional()
  tin?: string;

  @ApiPropertyOptional({ enum: ['pending', 'registered', 'exempt'] })
  @IsString()
  @IsOptional()
  vatStatus?: string;

  @ApiPropertyOptional({ enum: ['yes', 'no', 'pending'] })
  @IsString()
  @IsOptional()
  frscFleetStatus?: string;

  @ApiPropertyOptional({ enum: ['yes', 'no', 'pending'] })
  @IsString()
  @IsOptional()
  stateTransportPermit?: string;

  // Owner/Beneficial owner information
  @ApiPropertyOptional({ example: 'Agbo Terry Terwase' })
  @IsString()
  @IsOptional()
  ownerName?: string;

  @ApiPropertyOptional({ example: '+2349020722091' })
  @IsString()
  @IsOptional()
  ownerPhone?: string;

  @ApiPropertyOptional({ example: '44556789043' })
  @IsString()
  @IsOptional()
  ownerNIN?: string;

  @ApiPropertyOptional({ example: '2002-02-22' })
  @IsDateString()
  @IsOptional()
  ownerDOB?: string;

  @ApiPropertyOptional({ example: 'owner@email.com' })
  @IsEmail()
  @IsOptional()
  ownerEmail?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  ownershipPercentage?: number;

  // Document URLs (should be strings, not empty objects)
  @ApiPropertyOptional({
    example: 'https://storage.supabase.co/xyz/cac_certificate.pdf',
  })
  @IsUrl()
  @IsOptional()
  cacCertificate?: string;

  @ApiPropertyOptional({
    example: 'https://storage.supabase.co/xyz/cac_status_report.pdf',
  })
  @IsUrl()
  @IsOptional()
  cacStatusReport?: string;

  @ApiPropertyOptional({
    example: 'https://storage.supabase.co/xyz/utility_bill.pdf',
  })
  @IsUrl()
  @IsOptional()
  utilityBill?: string;

  @ApiPropertyOptional({
    example: 'https://storage.supabase.co/xyz/tax_clearance.pdf',
  })
  @IsUrl()
  @IsOptional()
  taxClearanceCertificate?: string;
}

export class ReviewKycDto {
  @ApiPropertyOptional({ example: 'All documents valid' })
  @IsString()
  @IsOptional()
  reviewNotes?: string;
}
