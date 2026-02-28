"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });
  const router = useRouter();

  const { register, registerErrors, registerLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await register(formData);

    if (res) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
      });
      router.replace(`/otp?user-id=${res}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
            Begin Your Journey
          </h1>
          <p className="text-lg text-neutral-600">
            Create your account to get personalized support
          </p>
        </div>

        {/* Form Card */}
        <GlassCard className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g., Alex Johnson"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={registerErrors.name}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={registerErrors.email}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={registerErrors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={registerErrors.confirmPassword}
              />
            </div>

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              error={registerErrors.dob}
            />

            <p className="text-sm text-red-500 text-center -mt-4">
              {registerErrors?.message}
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={registerLoading}
            >
              {registerLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/60 text-neutral-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Button href="/login" variant="outline" size="lg" fullWidth>
            Sign In
          </Button>
        </GlassCard>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-neutral-600 hover:text-calm-600 font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
