"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase returns the access_token in the URL hash fragment: #access_token=...
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");

      if (!accessToken) {
        toast.error("OAuth callback did not return a token.");
        router.push("/auth");
        return;
      }

      try {
        // Exchange the Supabase token for Rydway JWTs via our backend
        const response = await authService.exchangeOAuthToken(accessToken);
        login(response.tokens.accessToken, response.user);

        // Redirect based on role
        if (response.user.role === "host") {
          router.push("/dashboard/business");
        } else {
          router.push("/dashboard/renter");
        }
      } catch (err) {
        console.error("OAuth token exchange failed:", err);
        toast.error("Sign-in failed. Please try again.");
        router.push("/auth");
      }
    };

    handleCallback();
  }, [router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-secondary">Completing sign in...</p>
      </div>
    </div>
  );
}
