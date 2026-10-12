import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { ServiceCard } from "../ui/ServiceCard";
import { Button } from "../ui/Button";
import { Service } from "@/lib/db/schema";
import { ArrowRight } from "lucide-react";

interface ServicesPreviewProps {
  services: Service[];
}

export function ServicesPreviewSection({ services }: ServicesPreviewProps) {
  if (services.length === 0) return null;

  return (
    <section className="py-20 bg-[#F5F8FC] border-b border-[#E2E8F0]">
      <Container size="wide">
        <SectionHeading
          badge="What We Offer"
          title="Services & Institutional Training"
          description="From student internships to faculty development bootcamps and collegiate workshops, we deliver comprehensive biomedical technology services."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/services">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Services & Workshops
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
