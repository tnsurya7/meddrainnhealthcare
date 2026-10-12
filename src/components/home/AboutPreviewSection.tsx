import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { CheckCircle2, ArrowRight, Shield, Cpu } from "lucide-react";

interface AboutPreviewProps {
  aboutContent: string;
}

export function AboutPreviewSection({ aboutContent }: AboutPreviewProps) {
  const highlights = [
    "Hospital-grade diagnostic equipment & analyzers",
    "Direct hands-on disassembly and PCB calibration",
    "IEC 60601 & IEC 62353 electrical safety training",
    "Experienced clinical engineering faculty",
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E2E8F0]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="About Our Institute"
              title="Dedicated to Clinical Engineering Competence"
              align="left"
              className="mb-6"
            />
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              {aboutContent}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-[#172B4D]">{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/about">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Cards Showcase */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#10243A]">Practical-First Learning</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Trainees work on actual clinical monitors, ECG recorders, and ventilators rather than purely theoretical slides.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#0D9488] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#10243A]">Compliance & Safety Focus</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Learn hospital accreditation guidelines, preventive maintenance protocols, and patient leakage current limits.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
