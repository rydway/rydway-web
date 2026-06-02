"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export default function OtpForm({ email, onVerify, onResend }: OtpFormProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      if (pastedData.length === 6) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    setLoading(true);
    try {
      await onVerify(otpString);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      onResend();
      setResendTimer(30);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
        <p className="text-slate-600">
          We sent a code to <span className="font-semibold">{email}</span>
        </p>
        <p className="text-sm text-slate-500 mt-1">Enter the 6-digit code below</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={loading}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || otp.join("").length !== 6}
          className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Verify & Continue</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-600 mb-4">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`font-semibold ${
              resendTimer > 0
                ? "text-slate-400 cursor-not-allowed"
                : "text-primary hover:underline"
            }`}
          >
            Resend {resendTimer > 0 && `(${resendTimer}s)`}
          </button>
        </p>
        <p className="text-xs text-slate-500">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}