import { api } from "@/lib/api/client";
import { User } from "@/types/models";

export interface SignInCredentials {
  email: string;
  password?: string;
}

export interface SignUpData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "renter" | "host";
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/login", credentials);
  },

  async signUp(data: SignUpData): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/register", data);
  },

  async verifyOtp(email: string, otp: string): Promise<any> {
    return api.post("/auth/otp/verify", { email, otp });
  },

  async sendOtp(email: string): Promise<any> {
    return api.post("/auth/otp/send", { email });
  },

  async getProfile(): Promise<User> {
    return api.get<User>("/users/me");
  },

  /** Ask the backend to generate a Supabase OAuth URL — no Supabase SDK on client */
  async getOAuthUrl(provider: "google" | "facebook"): Promise<string> {
    const res = await api.post<{ url: string }>("/auth/oauth/url", { provider });
    return res.url;
  },

  /** Send the Supabase access_token from the callback fragment to get Rydway JWTs */
  async exchangeOAuthToken(accessToken: string, role?: string): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/oauth/exchange", { accessToken, role });
  },
};

