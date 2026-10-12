import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Microscope } from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  heroImageUrl?: string | null;
}

export function HeroSection({
  title,
  description,
  heroImageUrl,
}: HeroSectionProps) {
  const imageSrc =
    heroImageUrl ||
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85";

  return (
    <section className="relative bg-[#10243A] text-white pt-32 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* Dynamic Background Graphics */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10243A] via-[#142d48] to-[#10243A]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#155EEF]/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-100px] w-[400px] h-[400px] bg-[#0D9488]/20 rounded-full blur-[90px] pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#38BDF8] border border-white/15 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Center of Biomedical Excellence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
              <Link href="/courses" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-[#155EEF]/25"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Courses
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View Our Services
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg sm:text-xl">
                  <Activity className="w-4 h-4 text-[#38BDF8]" />
                  <span>100%</span>
                </div>
                <span className="text-xs text-slate-400">Practical Labs</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg sm:text-xl">
                  <Microscope className="w-4 h-4 text-[#0D9488]" />
                  <span>Real</span>
                </div>
                <span className="text-xs text-slate-400">Hospital Equipment</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg sm:text-xl">
                  <ShieldCheck className="w-4 h-4 text-[#155EEF]" />
                  <span>NABH</span>
                </div>
                <span className="text-xs text-slate-400">Standard Protocols</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#10243A]/80 backdrop-blur-xl group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imageSrc}
                  alt="Biomedical laboratory instrumentation training"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Float Tag / Stats Capsule */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-[#10243A]/90 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Training Center</p>
                  <p className="text-sm font-bold text-white">Erode, Tamil Nadu</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold text-emerald-300">
                    Active Batches
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
