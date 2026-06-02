import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileSettingsDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() profileImageUrl?: string;
}

export class UpdateNotificationSettingsDto {
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() emailNotifications?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() smsNotifications?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() pushNotifications?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() marketingEmails?: boolean;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImageUrl: true,
        kycStatus: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileSettingsDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        updatedAt: true,
      },
    });
  }

  // Notification settings stored in Redis per user as lightweight flags
  async getNotificationSettings(userId: string) {
    // In a full system, this would come from a UserSettings model
    // For now return safe defaults
    return {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
    };
  }

  async updateNotificationSettings(userId: string, dto: UpdateNotificationSettingsDto) {
    // TODO: Persist to a UserSettings table in future batch
    return { userId, ...dto, updatedAt: new Date() };
  }

  async updateSecuritySettings(userId: string, currentPassword: string, newPassword: string) {
    // Delegated to UsersService in a full implementation
    // This stub ensures the route exists and documents properly
    return { message: 'Use PATCH /users/me/password for password changes' };
  }
}
