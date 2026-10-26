import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { getPublishedCourses } from "@/lib/db/queries/courses";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, ExternalLink, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface ContactPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const canonicalUrl = getAbsoluteUrl("/contact");
  return {
    title: "Contact Us & Admission Desk",
    description: `Connect with ${settings.instituteName} in Erode, Tamil Nadu for hands-on biomedical training, internships, equipment workshops, and campus directions.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Contact Us & Admission Desk | ${settings.instituteName}`,
      description: `Connect with Meddrainn Healthcare at H-42, 80 Feet Road, Periyar Nagar, Erode - 638001, Tamil Nadu. Phone: +91 6380918863.`,
      url: canonicalUrl,
    },
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;
  const course = typeof resolvedParams?.course === "string" ? resolvedParams.course : undefined;
  const [settings, courses] = await Promise.all([
    getSiteSettings(),
    getPublishedCourses(),
  ]);

  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.address
  )}`;

  return (
    <div className="flex flex-col w-full pb-20">
      <PageHeader
        badge="Get in Touch"
        title="Contact Meddrainn Healthcare"
        description="Have questions regarding our hands-on medical equipment training batches, internships, or collegiate workshops? Reach out to our admissions office."
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <section className="py-12 bg-[#F5F8FC]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#10243A] mb-1">
                    Institute Location & Desk
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    Visit our training facility or connect with our clinical coordinators.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                        Campus Address
                      </span>
                      <p className="text-sm font-semibold text-[#172B4D] leading-relaxed">
                        {settings.address}
                      </p>
                      <a
                        href={mapDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:underline mt-1.5"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#0D9488] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                        Telephone & WhatsApp
                      </span>
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                        className="text-base font-bold text-[#10243A] hover:text-[#155EEF] transition-colors block"
                      >
                        {settings.phone}
                      </a>
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                        className="mt-2 inline-block"
                      >
                        <Button variant="outline" size="sm">
                          Click to Call Now
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                        Official Email
                      </span>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-sm font-semibold text-[#172B4D] hover:text-[#155EEF] transition-colors break-all"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                        Social Updates
                      </span>
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#172B4D] hover:text-[#155EEF] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Follow on Instagram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start gap-3.5 pt-2 border-t border-[#F1F5F9]">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#64748B] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                        Training Lab Hours
                      </span>
                      <p className="text-xs text-[#172B4D]">
                        Monday – Saturday: 9:30 AM – 6:00 PM
                      </p>
                      <p className="text-xs text-[#64748B]">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#10243A]">
                  Send an Academic Enquiry
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  Fill in your details below and our team will get in touch with you.
                </p>
              </div>

              <ContactForm
                initialCourse={course || ""}
                coursesList={courses.map((c) => ({ title: c.title }))}
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
