import { Controller, Get, Patch, Delete, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as bcrypt from 'bcrypt';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    const data = await this.usersService.findById(user.id);
    return {
      message: 'Profile fetched successfully',
      data,
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    const data = await this.usersService.updateUser(user.id, dto);
    return {
      message: 'Profile updated successfully',
      data,
    };
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Update current user password' })
  async updatePassword(@CurrentUser() user: any, @Body() dto: UpdatePasswordDto) {
    const fullUser = await this.usersService.findByEmail(user.email); // Need full user for passwordHash
    if (!fullUser) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, fullUser.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);
    await this.usersService.updatePassword(user.id, passwordHash);

    return {
      message: 'Password updated successfully',
      data: null,
    };
  }

  @Delete('me')
  @ApiOperation({ summary: 'Soft delete current user account' })
  async softDelete(@CurrentUser() user: any) {
    await this.usersService.softDelete(user.id);
    return {
      message: 'Account deleted successfully',
      data: null,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    const data = await this.usersService.findById(id);
    return {
      message: 'User fetched successfully',
      data,
    };
  }
}
