"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const redis_service_1 = require("../redis/redis.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../notifications/mail.service");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthService = class AuthService {
    usersService;
    jwtService;
    redisService;
    auditLogService;
    configService;
    mailService;
    constructor(usersService, jwtService, redisService, auditLogService, configService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.auditLogService = auditLogService;
        this.configService = configService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
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
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.emailVerifiedAt) {
            throw new common_1.UnauthorizedException('Email not verified');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const isValid = await this.redisService.get(`auth:refresh:${payload.sub}:${refreshToken}`);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            await this.redisService.del(`auth:refresh:${payload.sub}:${refreshToken}`);
            const user = await this.usersService.findById(payload.sub);
            const tokens = await this.generateTokens(user.id, user.role);
            return { tokens };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, refreshToken) {
        await this.redisService.del(`auth:refresh:${userId}:${refreshToken}`);
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'USER_LOGOUT',
            entityType: 'User',
            entityId: userId,
        });
        return true;
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.redisService.setex(`auth:otp:password:${email}`, 900, otp);
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
        return true;
    }
    async resetPassword(email, otp, newPassword) {
        const key = `auth:otp:password:${email}`;
        const storedOtp = await this.redisService.get(key);
        if (!storedOtp || storedOtp !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Invalid request');
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
    async sendVerificationOtp(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
    async verifyOtp(email, otp) {
        const key = `auth:otp:verify:${email}`;
        const storedOtp = await this.redisService.get(key);
        if (!storedOtp || storedOtp !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
    async generateTokens(userId, role) {
        const payload = { sub: userId, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        await this.redisService.setex(`auth:refresh:${userId}:${refreshToken}`, 7 * 24 * 60 * 60, '1');
        return { accessToken, refreshToken };
    }
    async getOAuthUrl(provider) {
        const supabase = this.getSupabaseClient();
        const redirectTo = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3001'}/auth/callback`;
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo, skipBrowserRedirect: true },
        });
        if (error || !data?.url) {
            throw new common_1.BadRequestException(`Failed to generate OAuth URL: ${error?.message}`);
        }
        return data.url;
    }
    async exchangeOAuthToken(accessToken, preferredRole) {
        const supabase = this.getSupabaseClient();
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(accessToken);
        if (error || !supabaseUser) {
            throw new common_1.UnauthorizedException('Invalid OAuth token');
        }
        const email = supabaseUser.email;
        if (!email)
            throw new common_1.UnauthorizedException('OAuth account has no email');
        let existingUser = await this.usersService.findByEmail(email);
        let userId;
        let userRole;
        let kycStatus;
        if (!existingUser) {
            const nameParts = (supabaseUser.user_metadata?.full_name || '').split(' ');
            const newUser = await this.usersService.createUser({
                email,
                firstName: nameParts[0] || 'User',
                lastName: nameParts.slice(1).join(' ') || '',
                role: preferredRole || 'renter',
                passwordHash: '',
                emailVerifiedAt: new Date(),
            });
            userId = newUser.id;
            userRole = newUser.role;
            kycStatus = newUser.kycStatus;
        }
        else {
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
    getSupabaseClient() {
        const url = this.configService.get('SUPABASE_URL') || '';
        const key = this.configService.get('SUPABASE_SERVICE_ROLE_KEY') || this.configService.get('SUPABASE_KEY') || '';
        return (0, supabase_js_1.createClient)(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        redis_service_1.RedisService,
        audit_log_service_1.AuditLogService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map