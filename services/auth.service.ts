import { api } from '@/lib/api/client';
import { User } from '@/types/models';

export interface SignInCredentials {
  email: string;
  password?: string;
}

export interface SignUpData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'renter' | 'host';
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  async signUp(data: SignUpData): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', data);
  },

  async verifyOtp(email: string, code: string): Promise<any> {
    return api.post('/auth/verify-otp', { email, code });
  },

  async resendOtp(email: string): Promise<any> {
    return api.post('/auth/resend-otp', { email });
  },

  async getProfile(): Promise<User> {
    return api.get<User>('/auth/profile');
  },
};
