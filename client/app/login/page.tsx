'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const wasRegistered = searchParams.get('registered') === 'true'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Simulate API authentication (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // On successful login, redirect to OTP page immediately
      router.push(`/otp?email=${encodeURIComponent(formData.email)}`)
    } catch (error) {
      setErrors({ 
        general: 'Unable to sign in. Please check your credentials and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-popsicle mb-2">
            Welcome Back
          </h1>
          <p className="text-grey-blue-leaf">
            Sign in to continue your journey
          </p>
        </div>

        {/* Success Message (if registered) */}
        {wasRegistered && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <p className="text-sm text-green-800 text-center">
              ✓ Account created successfully! Please sign in to continue.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border-2 border-redline rounded-xl">
                <p className="text-sm text-redline flex items-center gap-2">
                  <span className="text-lg">⚠</span> {errors.general}
                </p>
              </div>
            )}

            {/* Email Field */}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
                  ${errors.email 
                    ? 'border-redline bg-red-50' 
                    : 'border-silver-fox focus:border-yellow-primary'
                  }
                  text-deep-matte-grey placeholder:text-grey-blue-leaf`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-deep-matte-grey"
                >
                  Password
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-sm text-blue-popsicle hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
                  ${errors.password 
                    ? 'border-redline bg-red-50' 
                    : 'border-silver-fox focus:border-yellow-primary'
                  }
                  text-deep-matte-grey placeholder:text-grey-blue-leaf`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.password}
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
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-grey-blue-leaf text-sm">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-blue-popsicle font-medium hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}