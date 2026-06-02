import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService, UpdateProfileSettingsDto, UpdateNotificationSettingsDto } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get profile settings' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.settingsService.getProfile(user.id);
    return { message: 'Profile fetched successfully', data };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profile settings' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileSettingsDto) {
    const data = await this.settingsService.updateProfile(user.id, dto);
    return { message: 'Profile updated successfully', data };
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get notification preferences' })
  async getNotificationSettings(@CurrentUser() user: any) {
    const data = await this.settingsService.getNotificationSettings(user.id);
    return { message: 'Notification settings fetched successfully', data };
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  async updateNotificationSettings(@CurrentUser() user: any, @Body() dto: UpdateNotificationSettingsDto) {
    const data = await this.settingsService.updateNotificationSettings(user.id, dto);
    return { message: 'Notification settings updated successfully', data };
  }

  @Patch('security')
  @ApiOperation({ summary: 'Update security settings (redirects to password change)' })
  async updateSecuritySettings(@CurrentUser() user: any) {
    const data = await this.settingsService.updateSecuritySettings(user.id, '', '');
    return { message: 'Use PATCH /users/me/password to change your password', data };
  }
}
