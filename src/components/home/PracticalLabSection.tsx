import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Wrench, CheckCircle, ArrowRight, Gauge, ShieldAlert, Cpu } from "lucide-react";

export function PracticalLabSection() {
  const labFeatures = [
    {
      icon: <Gauge className="w-5 h-5 text-[#155EEF]" />,
      title: "Analyzer & Calibrator Integration",
      desc: "Direct operation with safety analyzers, patient simulators, and flow analyzers.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#0D9488]" />,
      title: "Circuit Board Diagnostics",
      desc: "Tracing biopotential amplifier stages, power supplies, and analog-to-digital converters.",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#38BDF8]" />,
      title: "Safety Standard Adherence",
      desc: "Evaluating ground leakage, patient auxiliary currents, and high-voltage defibrillator discharge.",
    },
  ];

  return (
    <section className="py-20 bg-[#10243A] text-white relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#155EEF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0D9488]/15 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Hands-on Environment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Practical Biomedical Training & Laboratory Methodology
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              We believe biomedical engineering cannot be learned from textbooks alone.
              Our laboratory is equipped with live medical devices where trainees disassemble,
              calibrate, measure waveforms, and simulate sensor faults.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "100% equipment-centric curriculum with zero unnecessary theory",
                "Hospital-standard breakdown logs and PPM documentation",
                "Hands-on multimeter and digital storage oscilloscope (DSO) usage",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <CheckCircle className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href="/contact">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Schedule a Lab Visit
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 gap-4">
            {labFeatures.map((feat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/10 shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
