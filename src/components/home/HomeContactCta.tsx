import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ArrowRight, Phone, MessageSquareQuote } from "lucide-react";

interface HomeContactCtaProps {
  phone: string;
}

export function HomeContactCta({ phone }: HomeContactCtaProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-[#10243A] via-[#142d48] to-[#10243A] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#155EEF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#0D9488]/20 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center max-w-4xl">
        <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#38BDF8] border border-white/15 mb-4">
          Admissions Open
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Ready to Master Practical Biomedical Engineering?
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed text-center !text-center">
          Join hands-on calibration and clinical instrumentation batches in Erode. Speak with our faculty coordinator today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-[#155EEF]/30"
              leftIcon={<MessageSquareQuote className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Submit Course Enquiry
            </Button>
          </Link>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20"
              leftIcon={<Phone className="w-4 h-4 text-[#38BDF8]" />}
            >
              Call: {phone}
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}
