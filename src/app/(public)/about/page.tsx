import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeContactCta } from "@/components/home/HomeContactCta";
import {
  CheckCircle2,
  Wrench,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Target,
  Compass,
} from "lucide-react";

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const canonicalUrl = getAbsoluteUrl("/about");
  return {
    title: "About Us",
    description: `Discover ${settings.instituteName}'s mission, hands-on biomedical training philosophy, and hospital clinical technology programs in Erode, Tamil Nadu.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `About Us | ${settings.instituteName}`,
      description: `Established in 2021, Meddrainn Healthcare equips future healthcare professionals with practical expertise and industry-ready skills.`,
      url: canonicalUrl,
    },
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const coreValues = [
    {
      title: "Hands-on Practical Dominance",
      description:
        "Every concept is validated on real biomedical hardware, patient simulators, and medical circuit boards.",
      icon: <Wrench className="w-5 h-5 text-[#155EEF]" />,
    },
    {
      title: "Strict Safety & Compliance",
      description:
        "Instilling international IEC 60601 electrical safety norms and NABH hospital audit discipline in every trainee.",
      icon: <ShieldCheck className="w-5 h-5 text-[#0D9488]" />,
    },
    {
      title: "Industry-Oriented Curriculum",
      description:
        "Curriculum shaped by current hospital maintenance challenges, field troubleshooting demands, and hospital biomedical requirements.",
      icon: <GraduationCap className="w-5 h-5 text-[#38BDF8]" />,
    },
    {
      title: "Career & Clinical Readiness",
      description:
        "Nurturing confident engineers capable of diagnosing medical equipment faults from their first day on the hospital floor.",
      icon: <Briefcase className="w-5 h-5 text-[#10243A]" />,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        badge="Established 2021"
        title="Equipping Future Biomedical & Healthcare Professionals"
        description="Connecting academic knowledge with real-world healthcare needs through hands-on training in medical equipment, sales and marketing, and hospital support services."
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Main About Two-Column Section */}
      <section className="py-20 bg-white border-b border-[#E2E8F0]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Educational Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                badge="Who We Are"
                title="Practical Expertise & Industry-Ready Skills"
                align="left"
                className="mb-4"
              />
              <div className="space-y-4 text-sm sm:text-base text-[#64748B] leading-relaxed font-normal">
                {settings.aboutContent.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-justify !text-justify [text-align:justify] [text-justify:inter-word] font-normal"
                    style={{ textAlign: "justify", textJustify: "inter-word" }}
                  >
                    {para.trim()}
                  </p>
                ))}
              </div>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed text-justify [text-align:justify]">
                Biomedical technology is among the fastest-evolving sectors in modern healthcare.
                However, traditional engineering coursework frequently leaves graduates unfamiliar
                with actual clinical hardware, safety analyzers, and hospital breakdown workflows.
                At Meddrainn Healthcare in Erode, we bridge this divide through specialized, laboratory-based
                training modules tailored to students and practicing healthcare technicians.
              </p>
              <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
                <h3 className="text-base font-bold text-[#10243A]">
                  Our Key Educational Approaches:
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Direct physical access to patient monitors, ECG units, and infusion pumps",
                    "Calibration procedures aligning with IEC 60601 / IEC 62353 safety protocols",
                    "Practical fault injection to train diagnostic and root-cause analysis skills",
                    "Comprehensive guidance for college internship projects and viva preparation",
                  ].map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#172B4D]">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Mission & Vision Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Mission Card */}
              <div className="p-8 rounded-3xl bg-[#F5F8FC] border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center font-bold">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#10243A]">Our Mission</h3>
                {settings.mission.includes("•") || settings.mission.includes("1.") ? (
                  <ol className="space-y-3">
                    {settings.mission
                      .split(/(?:\r?\n|(?=\b[1-9]\.\s+)|(?<=^|[.\n])\s*•\s*)/)
                      .map((p) => p.replace(/^[•\s\d.]+\s*/, "").trim())
                      .filter((p) => p.length > 0)
                      .map((point, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#155EEF]/10 text-[#155EEF] text-xs font-bold shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span
                            className="text-sm text-[#475569] leading-relaxed text-justify !text-justify [text-align:justify] [text-justify:inter-word] flex-1"
                            style={{ textAlign: "justify", textJustify: "inter-word" }}
                          >
                            {point}
                          </span>
                        </li>
                      ))}
                  </ol>
                ) : (
                  <p className="text-sm text-[#64748B] leading-relaxed text-justify [text-align:justify]">
                    {settings.mission}
                  </p>
                )}
              </div>

              {/* Vision Card */}
              <div className="p-8 rounded-3xl bg-[#F5F8FC] border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0fdfa] text-[#0D9488] flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#10243A]">Our Vision</h3>
                <p className="text-sm text-[#64748B] leading-relaxed text-justify [text-align:justify]">
                  {settings.vision}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 bg-[#F5F8FC] border-b border-[#E2E8F0]">
        <Container>
          <SectionHeading
            badge="Guiding Principles"
            title="Core Values That Drive Our Training"
            description="Our training programs adhere strictly to educational integrity, hands-on engineering, and biomedical safety."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-[#10243A] mb-2">{v.title}</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed flex-1">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <HomeContactCta phone={settings.phone} />
    </div>
  );
}
