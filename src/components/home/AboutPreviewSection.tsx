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
    {
      title: "Master Industry Tools",
      description:
        "Work directly with state-of-the-art, hospital-grade diagnostic equipment and software.",
    },
    {
      title: "Engage in Innovation",
      description:
        "Gain real-world experience through collaborative R&D initiatives.",
    },
    {
      title: "Ensure Clinical Safety",
      description:
        "Acquire essential training in BC and IEC electrical safety standards.",
    },
    {
      title: "Learn from Experts",
      description:
        "Study under highly experienced clinical engineering faculty members.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E2E8F0]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="About Our Institution"
              title="Dedicated to Biomedical Engineering Competence – Empowering the Next Generation of Biomedical Engineering Professionals"
              align="left"
              className="mb-6"
            />
            <div className="space-y-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
              {aboutContent.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-justify !text-justify [text-align:justify] [text-justify:inter-word]"
                  style={{ textAlign: "justify", textJustify: "inter-word" }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed text-[#475569]">
                    <strong className="font-semibold text-[#172B4D]">{h.title}: </strong>
                    {h.description}
                  </p>
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
