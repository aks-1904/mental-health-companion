"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import useAuth from "@/hooks/useAuth";

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user-id") || "";

  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const { verifyEmail, otpLoading: isSubmitting, otpErros: errors } = useAuth();

  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    }
  }, [userId, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await verifyEmail({ userId, otp });
    if (res) {
      // API request is success
      setOtp("");
      setCountdown(30);

      router.replace("/");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(30);

    // Resend OTP api call
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-calm-400 to-calm-600 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
            Check Your Email
          </h1>
          <p className="text-lg text-neutral-600">
            We sent a verification code to
          </p>
        </div>

        {/* Form Card */}
        <GlassCard className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Verification Code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              error={errors.otp}
              className="text-center text-2xl font-semibold tracking-[0.5em]"
            />

            <p className="text-red-500 text-sm -mt-4 text-center">
              {errors?.userId}
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="h-px bg-linear-to-r from-transparent via-neutral-300 to-transparent"></div>

            {canResend ? (
              <button
                onClick={handleResend}
                className="text-calm-600 hover:text-calm-700 font-semibold transition-colors"
              >
                Resend verification code
              </button>
            ) : (
              <p className="text-neutral-600">
                Resend code in{" "}
                <span className="font-semibold text-calm-600">
                  {countdown}s
                </span>
              </p>
            )}
          </div>
        </GlassCard>

        {/* Help Text */}
        <div className="text-center text-sm text-neutral-600 space-y-2">
          <p>Didn't receive the code? Check your spam folder</p>
          <p>
            or{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-calm-600 hover:text-calm-700 font-medium transition-colors"
            >
              try signing in again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
