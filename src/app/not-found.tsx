import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center py-20 px-4">
      <Container size="narrow" className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <HelpCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF] block mb-2">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-base text-[#64748B] max-w-md mx-auto mb-8 leading-relaxed">
          The requested biomedical course, service, or page could not be located.
          It may have been moved or updated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return to Homepage
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}
            >
              Explore Courses
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
