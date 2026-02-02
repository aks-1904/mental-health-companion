import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-300 transform active:scale-95
    focus:outline-none focus:ring-4 focus:ring-primary-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-calm-500 to-calm-600 text-white
      hover:from-calm-600 hover:to-calm-700 hover:shadow-lg hover:-translate-y-0.5
      shadow-md
    `,
    secondary: `
      bg-gradient-to-r from-primary-400 to-primary-500 text-white
      hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:-translate-y-0.5
      shadow-md
    `,
    ghost: `
      bg-white/50 backdrop-blur-sm text-neutral-700 border border-neutral-200
      hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5
    `,
    outline: `
      bg-transparent border-2 border-calm-500 text-calm-600
      hover:bg-calm-50 hover:border-calm-600 hover:-translate-y-0.5
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
