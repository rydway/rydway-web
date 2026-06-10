import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { IsString, IsIn } from 'class-validator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return {
      message: 'Account created successfully',
      data,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      message: 'Logged in successfully',
      data,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() refreshDto: RefreshDto) {
    const data = await this.authService.refresh(refreshDto.refreshToken);
    return {
      message: 'Token refreshed',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@CurrentUser() user: any, @Body() refreshDto: RefreshDto) {
    await this.authService.logout(user.id, refreshDto.refreshToken);
    return {
      message: 'Logged out successfully',
      data: null,
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return {
      message: 'If the email exists, an OTP will be sent.',
      data: null,
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
    return {
      message: 'Password reset successfully',
      data: null,
    };
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email verification OTP' })
  async sendOtp(@Body() dto: ForgotPasswordDto) {
    await this.authService.sendVerificationOtp(dto.email);
    return {
      message: 'Verification OTP sent',
      data: null,
    };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email using OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto.email, dto.otp);
    return {
      message: 'Email verified successfully',
      data: null,
    };
  }

  @Public()
  @Post('oauth/url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get OAuth redirect URL for a provider (google | facebook)' })
  async getOAuthUrl(@Body('provider') provider: 'google' | 'facebook') {
    const url = await this.authService.getOAuthUrl(provider);
    return {
      message: 'OAuth URL generated',
      data: { url },
    };
  }

  @Public()
  @Post('oauth/exchange')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange Supabase OAuth access token for a Rydway JWT' })
  async exchangeOAuthToken(@Body('accessToken') accessToken: string, @Body('role') role?: string) {
    const data = await this.authService.exchangeOAuthToken(accessToken, role);
    return {
      message: 'OAuth login successful',
      data,
    };
  }
}
