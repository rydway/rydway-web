"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";

import OtpForm from "@/components/pages/auth/OtpForm";
import SignInForm from "@/components/pages/auth/SignInForm";
import SignUpForm from "@/components/pages/auth/SignUpForm";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      const response = await authService.signIn(data);
      login(response.tokens.accessToken, response.user);
      
      // Redirect based on role
      if (response.user.role === 'host') {
        router.push('/dashboard/business');
      } else {
        router.push('/dashboard/renter');
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error(error instanceof Error ? error.message : "Sign in failed");
      throw error; // Let the form know it failed
    }
  };

  const handleSignUp = async (data: { 
    email: string; 
    password: string; 
    name: string;
    userType: 'business' | 'renter';
  }) => {
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await authService.signUp({
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        role: data.userType === 'business' ? 'host' : 'renter',
      });
      
      setEmail(data.email);
      setMode('otp');
    } catch (error) {
      console.error("Sign up failed:", error);
      toast.error(error instanceof Error ? error.message : "Sign up failed");
      throw error;
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      toast.success("Verification successful. Please sign in.");
      setMode('signin');
    } catch (error) {
      console.error("OTP Verification failed:", error);
      toast.error(error instanceof Error ? error.message : "Verification failed");
      throw error;
    }
  };

  const handleOtpResend = async () => {
    try {
      await authService.resendOtp(email);
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Resend OTP failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to resend OTP");
      throw error;
    }
  };

  return (
    <div>
      {mode === 'signin' && (
        <SignInForm
          onSubmit={handleSignIn}
          onToggleMode={() => setMode('signup')}
        />
      )}

      {mode === 'signup' && (
        <SignUpForm
          onSubmit={handleSignUp}
          onToggleMode={() => setMode('signin')}
        />
      )}

      {mode === 'otp' && (
        <OtpForm
          email={email}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
        />
      )}
    </div>
  );
}