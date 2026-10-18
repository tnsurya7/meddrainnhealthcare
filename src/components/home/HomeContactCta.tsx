import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ArrowRight, Phone } from "lucide-react";

interface HomeContactCtaProps {
  phone?: string;
}

export function HomeContactCta({ phone = "+91 6380918863" }: HomeContactCtaProps) {
  const displayPhone = phone || "+91 6380918863";

  return (
    <section className="py-20 bg-gradient-to-r from-[#10243A] via-[#142d48] to-[#10243A] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#155EEF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#0D9488]/20 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center max-w-4xl">
        <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#38BDF8] border border-white/15 mb-4">
          ADMISSIONS OPEN
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Get Hands-On Training in Biomedical Equipment
        </h2>
        <div className="max-w-3xl mx-auto mb-8 space-y-3 text-slate-300 text-base sm:text-lg leading-relaxed text-center">
          <p>
            Learn to operate, understand, and maintain essential medical equipment with practical training at Meddrainn Healthcare, Erode.
          </p>
          <p className="text-sm sm:text-base text-slate-300/90">
            Explore real medical devices, develop technical skills, and gain practical exposure to equipment handling, preventive maintenance, and basic troubleshooting under expert guidance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-[#155EEF]/30"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Explore Our Courses
            </Button>
          </Link>
          <a
            href={`tel:${displayPhone.replace(/\s+/g, "")}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20"
              leftIcon={<Phone className="w-4 h-4 text-[#38BDF8]" />}
            >
              Call: {displayPhone}
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}
