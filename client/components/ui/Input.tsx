import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-neutral-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          w-full px-5 py-3.5 rounded-xl
          bg-white/60 backdrop-blur-sm
          border-2 transition-all duration-300
          text-neutral-800 placeholder:text-neutral-400
          focus:outline-none focus:ring-4
          ${
            error
              ? "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/20 bg-red-50/30"
              : "border-neutral-200 focus:border-calm-400 focus:ring-calm-100"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-accent-rose flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
