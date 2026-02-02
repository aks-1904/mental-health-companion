'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  dob?: string
  gender?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Email validation using RFC-compliant regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Date of birth validation (cannot be future date)
  const validateDOB = (dob: string): boolean => {
    const selectedDate = new Date(dob)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate <= today
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords dont match yet'
    }

    if (!formData.dob) {
      newErrors.dob = 'Please select your date of birth'
    } else if (!validateDOB(formData.dob)) {
      newErrors.dob = 'Please check your date of birth'
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender'
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

    try {
      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // On success, redirect to login
      router.push('/login?registered=true')
    } catch (error) {
      setErrors({ 
        email: 'Something went wrong. Please try again in a moment.' 
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
            Welcome to MindCare
          </h1>
          <p className="text-grey-blue-leaf">
            Create your account to get started
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-deep-matte-grey mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
                  ${errors.name 
                    ? 'border-redline bg-red-50' 
                    : 'border-silver-fox focus:border-yellow-primary'
                  }
                  text-deep-matte-grey placeholder:text-grey-blue-leaf`}
                placeholder="e.g., Alex Johnson"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </div>

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
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-deep-matte-grey mb-2"
              >
                Password
              </label>
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
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-deep-matte-grey mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
                  ${errors.confirmPassword 
                    ? 'border-redline bg-red-50' 
                    : 'border-silver-fox focus:border-yellow-primary'
                  }
                  text-deep-matte-grey placeholder:text-grey-blue-leaf`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div>
              <label 
                htmlFor="dob" 
                className="block text-sm font-medium text-deep-matte-grey mb-2"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors
                  ${errors.dob 
                    ? 'border-redline bg-red-50' 
                    : 'border-silver-fox focus:border-yellow-primary'
                  }
                  text-deep-matte-grey`}
              />
              {errors.dob && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.dob}
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-deep-matte-grey mb-3">
                Gender
              </label>
              <div className="space-y-3">
                {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((option) => (
                  <label 
                    key={option}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-5 h-5 text-yellow-primary focus:ring-yellow-primary 
                                 border-grey-blue-leaf cursor-pointer"
                    />
                    <span className="text-deep-matte-grey group-hover:text-blue-popsicle 
                                   transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-2 text-sm text-redline flex items-center gap-1">
                  <span>⚠</span> {errors.gender}
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
              {isSubmitting ? 'Creating your account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-grey-blue-leaf text-sm">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-blue-popsicle font-medium hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}