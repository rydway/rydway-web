import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    refresh(refreshDto: RefreshDto): Promise<{
        message: string;
        data: {
            tokens: {
                accessToken: string;
                refreshToken: string;
            };
        };
    }>;
    logout(user: any, refreshDto: RefreshDto): Promise<{
        message: string;
        data: null;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        data: null;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
        data: null;
    }>;
    sendOtp(dto: ForgotPasswordDto): Promise<{
        message: string;
        data: null;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
        data: null;
    }>;
}
