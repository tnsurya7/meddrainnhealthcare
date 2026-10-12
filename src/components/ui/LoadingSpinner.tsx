import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <Loader2 className="w-8 h-8 animate-spin text-[#155EEF] mb-3" />
      <p className="text-sm font-medium text-[#64748B]">{message}</p>
    </div>
  );
}
