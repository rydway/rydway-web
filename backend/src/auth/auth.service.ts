import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private auditLogService: AuditLogService,
    private configService: ConfigService,
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
      
      // TODO: Send OTP via email/SMS service
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
}
