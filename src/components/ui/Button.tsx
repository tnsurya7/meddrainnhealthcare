import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "teal";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg select-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 font-semibold",
    md: "text-sm px-4 py-2.5 gap-2 font-semibold",
    lg: "text-base px-6 py-3.5 gap-2.5 font-bold shadow-sm",
  }[size];

  const variantStyles = {
    primary:
      "bg-[#155EEF] hover:bg-[#1048b8] text-white shadow-sm hover:shadow active:scale-[0.98]",
    secondary:
      "bg-[#10243A] hover:bg-[#173252] text-white shadow-sm active:scale-[0.98]",
    teal: "bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-sm active:scale-[0.98]",
    outline:
      "border border-[#E2E8F0] bg-white text-[#172B4D] hover:bg-[#F5F8FC] hover:border-[#CBD5E1] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#172B4D] hover:bg-[#F5F8FC] active:scale-[0.98]",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]",
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
