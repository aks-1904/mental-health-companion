"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FormErrors {
  otp?: string;
  general?: string;
}

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer state
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Redirect if no email in URL
  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!otp.trim()) {
      newErrors.otp = "Please enter the verification code";
    } else if (otp.length !== 6) {
      newErrors.otp = "Verification code should be 6 digits";
    } else if (!/^\d+$/.test(otp)) {
      newErrors.otp = "Verification code should only contain numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate OTP verification (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On successful verification, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setErrors({
        general: "The code you entered is incorrect. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(30);
    setErrors({});

    try {
      // Simulate resend API call (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Show success feedback
      setErrors({ general: "" }); // Clear errors to show success
    } catch (error) {
      setErrors({
        general: "Unable to resend code. Please try again in a moment.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-popsicle mb-2">
            Verify Your Email
          </h1>
          <p className="text-grey-blue-leaf mb-1">
            We've sent a 6-digit code to
          </p>
          <p className="text-deep-matte-grey font-medium">{email}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error/Success */}
            {errors.general && (
              <div className="p-4 bg-red-50 border-2 border-redline rounded-xl">
                <p className="text-sm text-redline flex items-center gap-2">
                  <span className="text-lg">⚠</span> {errors.general}
                </p>
              </div>
            )}

            {/* Email Field (Read-only) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-deep-matte-grey mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 rounded-xl border-2 border-silver-fox
                         bg-gray-50 text-grey-blue-leaf cursor-not-allowed"
              />
            </div>

            {/* OTP Field */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-deep-matte-grey mb-2"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
                  text-center text-2xl font-semibold tracking-widest
                  ${
                    errors.otp
                      ? "border-redline bg-red-50"
                      : "border-silver-fox focus:border-yellow-primary"
                  }
                  text-deep-matte-grey placeholder:text-grey-blue-leaf`}
                placeholder="000000"
              />
              {errors.otp && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.otp}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-primary hover:bg-opacity-90 disabled:bg-silver-fox 
                       disabled:cursor-not-allowed text-purple-shadow font-semibold 
                       py-4 rounded-xl transition-all transform hover:scale-[1.02] 
                       active:scale-[0.98] shadow-md"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-popsicle font-medium hover:underline text-sm"
              >
                Resend verification code
              </button>
            ) : (
              <p className="text-grey-blue-leaf text-sm">
                You can request a new code in{" "}
                <span className="font-semibold text-deep-matte-grey">
                  {countdown}s
                </span>
              </p>
            )}
          </div>

          {/* Help Text */}
          <p className="mt-6 text-center text-grey-blue-leaf text-xs">
            Didn't receive the code? Check your spam folder or{" "}
            <a href="/login" className="text-blue-popsicle hover:underline">
              try signing in again
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
