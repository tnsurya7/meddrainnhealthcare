import React from "react";
import Link from "next/link";
import { Service } from "@/lib/db/schema";
import {
  Activity,
  Stethoscope,
  GraduationCap,
  Wrench,
  Cpu,
  Presentation,
  Users,
  Compass,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Stethoscope,
  GraduationCap,
  Wrench,
  Cpu,
  Presentation,
  Users,
  Compass,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Activity;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md hover:border-[#155EEF]/40 transition-all duration-300 group">
      {/* Icon Capsule */}
      <div className="w-13 h-13 rounded-xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center mb-5 group-hover:bg-[#155EEF] group-hover:text-white transition-all duration-300">
        <IconComponent className="w-6 h-6" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#10243A] group-hover:text-[#155EEF] transition-colors mb-2.5">
        {service.title}
      </h3>

      <p className="text-sm text-[#64748B] leading-relaxed mb-6 flex-1">
        {service.description}
      </p>

      <div className="pt-2 border-t border-[#F1F5F9]">
        <Link
          href={`/contact?course=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center text-sm font-semibold text-[#155EEF] group-hover:text-[#1048b8] transition-colors gap-1.5"
        >
          <span>Enquire About Service</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
