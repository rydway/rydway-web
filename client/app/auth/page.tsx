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
  const [mode, setMode] = useState<"signin" | "signup" | "otp">("signin");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      const response = await authService.signIn(data);
      login(response.tokens.accessToken, response.user);

      // Check KYC status and redirect accordingly
      if (response.user.kycStatus === "unsubmitted") {
        // Redirect to KYC page based on role
        if (response.user.role === "host") {
          router.push("/kyc/business");
        } else {
          router.push("/kyc/renter");
        }
      } else {
        // Redirect to dashboard based on role
        if (response.user.role === "host") {
          router.push("/dashboard/business");
        } else {
          router.push("/dashboard/renter");
        }
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      if (errorMessage === "Email not verified" || errorMessage.includes("Email not verified")) {
        toast.error("Email not verified. Sending verification code...");
        try {
          await authService.sendOtp(data.email);
          setEmail(data.email);
          setMode("otp");
          toast.success("Verification code sent to your email");
        } catch (otpError) {
          toast.error("Failed to send verification code");
        }
        return; // Don't throw error
      }
      toast.error(errorMessage);
      throw error; // Let the form know it failed
    }
  };

  const handleSignUp = async (data: {
    email: string;
    password: string;
    name: string;
    userType: "business" | "renter";
  }) => {
    try {
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      // 1. Create the user account
      const response = await authService.signUp({
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        role: data.userType === "business" ? "host" : "renter",
      });

      // 2. Send OTP to the user's email
      await authService.sendOtp(data.email); // Add this method call

      setEmail(data.email);
      setMode("otp");

      toast.success("Verification code sent to your email");
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
      setMode("signin");
    } catch (error) {
      console.error("OTP Verification failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Verification failed",
      );
      throw error;
    }
  };

  const handleOtpResend = async () => {
    try {
      await authService.sendOtp(email);
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Resend OTP failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to resend OTP",
      );
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const url = await authService.getOAuthUrl('google');
      window.location.href = url;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const url = await authService.getOAuthUrl('facebook');
      window.location.href = url;
    } catch (error) {
      console.error('Facebook Sign In Error:', error);
      toast.error('Failed to sign in with Facebook');
    }
  };

  return (
    <div>
      {mode === "signin" && (
        <SignInForm
          onSubmit={handleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          onFacebookSignIn={handleFacebookSignIn}
          onToggleMode={() => setMode("signup")}
        />
      )}

      {mode === "signup" && (
        <SignUpForm
          onSubmit={handleSignUp}
          onGoogleSignIn={handleGoogleSignIn}
          onFacebookSignIn={handleFacebookSignIn}
          onToggleMode={() => setMode("signin")}
        />
      )}

      {mode === "otp" && (
        <OtpForm
          email={email}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
        />
      )}
    </div>
  );
}
