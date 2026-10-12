import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { GalleryImage } from "@/lib/db/schema";
import { ArrowRight } from "lucide-react";

interface GalleryPreviewProps {
  images: GalleryImage[];
}

export function GalleryPreviewSection({ images }: GalleryPreviewProps) {
  if (images.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-[#E2E8F0]">
      <Container size="wide">
        <SectionHeading
          badge="Campus & Training"
          title="Practical Laboratory Gallery"
          description="A glimpse of hands-on sessions, equipment testing, college workshops, and student training at Meddrainn Healthcare."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {images.slice(0, 6).map((img) => (
            <Link
              key={img.id}
              href="/gallery"
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#10243A] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || img.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10243A]/90 via-[#10243A]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute top-3 left-3">
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-[#10243A]/85 text-[#38BDF8] backdrop-blur-md border border-white/10">
                  {img.category}
                </span>
              </div>
              <div className="absolute bottom-3 inset-x-3 text-white">
                <h3 className="font-bold text-sm leading-snug line-clamp-1">
                  {img.title}
                </h3>
                {img.caption && (
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {img.caption}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/gallery">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Gallery
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
