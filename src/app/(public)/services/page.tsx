import React from "react";
import type { Metadata } from "next";
import { getPublishedServices } from "@/lib/db/queries/services";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { HomeContactCta } from "@/components/home/HomeContactCta";

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Services & Programs | Meddrainn Healthcare",
  description:
    "Explore our professional services including hands-on equipment training, student internships, implant training, college workshops, seminars, webinars, and medical coding in Erode.",
  alternates: {
    canonical: getAbsoluteUrl("/services"),
  },
  openGraph: {
    title: "Our Services & Programs | Meddrainn Healthcare",
    description:
      "Hands-on hospital equipment training, verified academic internships, institutional workshops, seminars, webinars, and medical coding in Erode.",
    url: getAbsoluteUrl("/services"),
  },
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getPublishedServices(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col w-full pb-20">
      <PageHeader
        badge="Practical Healthcare Programs"
        title="Our Services"
        description="Providing hands-on hospital equipment training, verified academic internships, implant programs, institutional workshops, seminars, webinars, and medical coding."
        breadcrumbs={[{ label: "Our Services" }]}
      />

      <section className="py-16 bg-[#F5F8FC]">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <HomeContactCta phone={settings.phone} />
    </div>
  );
}
