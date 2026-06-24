import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notifications/mail.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersService.createUser({
      email: registerDto.email,
      phone: registerDto.phone,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role,
      passwordHash,
    });

    const tokens = await this.generateTokens(user.id, user.role);

    await this.auditLogService.logAction({
      actorId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
    });

    return { user, tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email not verified');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.role);

    await this.auditLogService.logAction({
      actorId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const isValid = await this.redisService.get(`auth:refresh:${payload.sub}:${refreshToken}`);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.redisService.del(`auth:refresh:${payload.sub}:${refreshToken}`);

      const user = await this.usersService.findById(payload.sub);
      const tokens = await this.generateTokens(user.id, user.role);
      
      return { tokens };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    await this.redisService.del(`auth:refresh:${userId}:${refreshToken}`);
    await this.auditLogService.logAction({
      actorId: userId,
      action: 'USER_LOGOUT',
      entityType: 'User',
      entityId: userId,
    });
    return true;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // Generate OTP and store in Redis
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.redisService.setex(`auth:otp:password:${email}`, 900, otp); // 15 mins
      
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the following OTP to proceed:</p>
          <h1 style="color: #3b82f6; font-size: 32px; letter-spacing: 4px; text-align: center; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This is an automated notification from Rydway. Please do not reply to this email.</p>
        </div>
      `;
      
      await this.mailService.sendEmail(email, 'Rydway: Password Reset OTP', emailHtml);
      console.log(`[DEV ONLY] OTP for ${email} is ${otp}`);

      await this.auditLogService.logAction({
        actorId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'User',
        entityId: user.id,
      });
    }
    // Always return success to avoid email enumeration
    return true;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const key = `auth:otp:password:${email}`;
    const storedOtp = await this.redisService.get(key);
    
    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await this.usersService.updatePassword(user.id, passwordHash);
    await this.redisService.del(key);

    await this.auditLogService.logAction({
      actorId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'User',
      entityId: user.id,
    });

    return true;
  }

  async sendVerificationOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.setex(`auth:otp:verify:${email}`, 900, otp);
    
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Email Verification</h2>
        <p>Hello,</p>
        <p>Please use the following OTP to verify your email address:</p>
        <h1 style="color: #3b82f6; font-size: 32px; letter-spacing: 4px; text-align: center; margin: 20px 0;">${otp}</h1>
        <p>This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">This is an automated notification from Rydway. Please do not reply to this email.</p>
      </div>
    `;

    await this.mailService.sendEmail(email, 'Rydway: Verify your email', emailHtml);
    console.log(`[DEV ONLY] Verification OTP for ${email} is ${otp}`);
    return true;
  }

  async verifyOtp(email: string, otp: string) {
    const key = `auth:otp:verify:${email}`;
    const storedOtp = await this.redisService.get(key);

    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersService.updateUser(user.id, { emailVerifiedAt: new Date() });
    await this.redisService.del(key);

    await this.auditLogService.logAction({
      actorId: user.id,
      action: 'EMAIL_VERIFIED',
      entityType: 'User',
      entityId: user.id,
    });

    return true;
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    // Store refresh token in redis
    await this.redisService.setex(`auth:refresh:${userId}:${refreshToken}`, 7 * 24 * 60 * 60, '1');

    return { accessToken, refreshToken };
  }

  /**
   * Returns a Supabase OAuth redirect URL for the given provider.
   * All secrets stay server-side — the client never touches Supabase directly.
   */
  async getOAuthUrl(provider: 'google' | 'facebook'): Promise<string> {
    const supabase = this.getSupabaseClient();
    const redirectTo = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001'}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error || !data?.url) {
      throw new BadRequestException(`Failed to generate OAuth URL: ${error?.message}`);
    }
    return data.url;
  }

  /**
   * Accepts a Supabase access token (from the OAuth callback fragment),
   * looks up or creates the user in our DB, and returns Rydway JWTs.
   */
  async exchangeOAuthToken(accessToken: string, preferredRole?: string) {
    const supabase = this.getSupabaseClient();

    // Validate the token with Supabase and fetch the user
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(accessToken);
    if (error || !supabaseUser) {
      throw new UnauthorizedException('Invalid OAuth token');
    }

    const email = supabaseUser.email;
    if (!email) throw new UnauthorizedException('OAuth account has no email');

    // Find or create user in our own DB
    let existingUser = await this.usersService.findByEmail(email);
    let userId: string;
    let userRole: string;
    let kycStatus: string;

    if (!existingUser) {
      const nameParts = (supabaseUser.user_metadata?.full_name || '').split(' ');
      const newUser = await this.usersService.createUser({
        email,
        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || '',
        role: (preferredRole as any) || 'renter',
        passwordHash: '',           // no password for OAuth users
        emailVerifiedAt: new Date(), // already verified by provider
      } as any);
      userId = newUser.id;
      userRole = newUser.role;
      kycStatus = newUser.kycStatus;
    } else {
      userId = existingUser.id;
      userRole = existingUser.role;
      kycStatus = existingUser.kycStatus;
    }

    const tokens = await this.generateTokens(userId, userRole);

    await this.auditLogService.logAction({
      actorId: userId,
      action: 'USER_OAUTH_LOGIN',
      entityType: 'User',
      entityId: userId,
    });

    return {
      user: {
        id: userId,
        email,
        role: userRole,
        kycStatus,
      },
      tokens,
    };
  }

  private getSupabaseClient() {
    const url = this.configService.get<string>('SUPABASE_URL') || '';
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || this.configService.get<string>('SUPABASE_KEY') || ''; 
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  }
}
