import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notifications/mail.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private redisService;
    private auditLogService;
    private configService;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, redisService: RedisService, auditLogService: AuditLogService, configService: ConfigService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string, refreshToken: string): Promise<boolean>;
    forgotPassword(email: string): Promise<boolean>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<boolean>;
    sendVerificationOtp(email: string): Promise<boolean>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    private generateTokens;
    getOAuthUrl(provider: 'google' | 'facebook'): Promise<string>;
    exchangeOAuthToken(accessToken: string, preferredRole?: string): Promise<{
        user: {
            id: string;
            email: string;
            role: string;
            kycStatus: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    private getSupabaseClient;
}
