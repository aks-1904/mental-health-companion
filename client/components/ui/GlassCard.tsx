import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "xl";
}

export default function GlassCard({
  children,
  className = "",
  hover = false,
  padding = "lg",
}: GlassCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <div
      className={`
        glass rounded-3xl
        ${hover ? "glass-hover" : ""}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
