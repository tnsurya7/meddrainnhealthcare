import React from "react";
import { Container } from "../ui/Container";
import { Target, Compass } from "lucide-react";

interface MissionVisionProps {
  mission: string;
  vision: string;
}

export function MissionVisionSection({ mission, vision }: MissionVisionProps) {
  return (
    <section className="py-20 bg-[#F5F8FC]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF] mb-1">
              Our Purpose
            </span>
            <h3 className="text-2xl font-bold text-[#10243A] mb-4">Our Mission</h3>
            <p className="text-base text-[#64748B] leading-relaxed flex-1">
              {mission}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-[#f0fdfa] text-[#0D9488] flex items-center justify-center mb-6">
              <Compass className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] mb-1">
              Our Future
            </span>
            <h3 className="text-2xl font-bold text-[#10243A] mb-4">Our Vision</h3>
            <p className="text-base text-[#64748B] leading-relaxed flex-1">
              {vision}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
