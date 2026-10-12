"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely server-side or in console without leaking credentials
    console.error("Application error boundary triggered:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center py-20 px-4">
      <Container size="narrow" className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-200">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2">
          Service Notice
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-4">
          Something Went Wrong
        </h1>
        <p className="text-base text-[#64748B] max-w-md mx-auto mb-8 leading-relaxed">
          We encountered an unexpected issue while loading this page. Our technical team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return to Homepage
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
