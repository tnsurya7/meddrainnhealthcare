import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, Mail, Phone, Lock } from "lucide-react";

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const canonicalUrl = getAbsoluteUrl("/privacy");
  return {
    title: `Privacy Notice | ${settings.instituteName}`,
    description: `Privacy notice and student data protection guidelines for ${settings.instituteName} in Erode.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Privacy Notice | ${settings.instituteName}`,
      description: `Privacy policy and enquiry data protection guidelines for ${settings.instituteName}.`,
      url: canonicalUrl,
    },
  };
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col w-full pb-20">
      <PageHeader
        badge="Data Protection"
        title="Privacy Notice"
        description="Understanding how Meddrainn Healthcare handles your personal details, admission enquiries, and educational records."
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="py-14 bg-[#F5F8FC]">
        <Container size="narrow">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm space-y-8 text-[#172B4D]">
            {/* Custom Admin Configurable Policy Body */}
            <div>
              <h2 className="text-xl font-bold text-[#10243A] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0D9488]" />
                <span>Our Privacy Commitment</span>
              </h2>
              <div className="text-sm sm:text-base text-[#64748B] leading-relaxed whitespace-pre-line">
                {settings.privacyPolicyContent}
              </div>
            </div>

            {/* Information Collected */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              <h3 className="text-lg font-bold text-[#10243A]">
                1. Information We Collect
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                When you submit an admission enquiry form or enroll in a training program, we may collect:
              </p>
              <ul className="list-disc pl-5 text-sm text-[#64748B] space-y-1.5">
                <li>Your full name and contact phone / WhatsApp number</li>
                <li>Your email address</li>
                <li>Your college / academic background and course of interest</li>
                <li>Any notes or queries you voluntarily submit in message fields</li>
              </ul>
            </div>

            {/* Purpose */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              <h3 className="text-lg font-bold text-[#10243A]">
                2. Purpose of Collection
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                The collected information is used strictly to:
              </p>
              <ul className="list-disc pl-5 text-sm text-[#64748B] space-y-1.5">
                <li>Respond directly to your course enquiries and provide syllabus details</li>
                <li>Coordinate batch schedules and laboratory seat availability</li>
                <li>Maintain student registration records for internship certifications</li>
              </ul>
              <p className="text-sm text-[#64748B] leading-relaxed">
                We do not sell, rent, or trade your personal information with third-party marketing agencies.
              </p>
            </div>

            {/* Student Privacy & Consent */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              <h3 className="text-lg font-bold text-[#10243A]">
                3. Student Privacy & Showcase Consent
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Student records are private by default. Photographs, project achievements, or testimonials
                are only featured on public showcase sections with prior documented consent from the respective
                student or guardian.
              </p>
            </div>

            {/* Data Retention & Deletion */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              <h3 className="text-lg font-bold text-[#10243A]">
                4. Data Retention & Requests for Deletion
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                We retain enquiry records only for the duration necessary to provide educational assistance.
                If you wish to have your submitted contact details updated or permanently deleted from our records,
                please email our desk at{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="text-[#155EEF] font-semibold hover:underline"
                >
                  {settings.email}
                </a>.
              </p>
            </div>

            {/* Contact for Privacy Queries */}
            <div className="pt-6 border-t border-[#E2E8F0] bg-[#F5F8FC] p-6 rounded-2xl space-y-2">
              <h4 className="text-sm font-bold text-[#10243A]">
                Contact Admissions Office:
              </h4>
              <p className="text-xs text-[#64748B]">
                {settings.instituteName}, {settings.address}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#155EEF] pt-1">
                <span>Phone: {settings.phone}</span>
                <span>Email: {settings.email}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
