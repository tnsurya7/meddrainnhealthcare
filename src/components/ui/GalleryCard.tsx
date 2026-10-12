import React from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/db/schema";
import { Calendar, Maximize2 } from "lucide-react";

interface GalleryCardProps {
  image: GalleryImage;
  onOpenLightbox: (image: GalleryImage) => void;
}

export function GalleryCard({ image, onOpenLightbox }: GalleryCardProps) {
  return (
    <div
      onClick={() => onOpenLightbox(image)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenLightbox(image);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View photo: ${image.title}`}
      className="group relative rounded-2xl overflow-hidden bg-[#10243A] border border-[#E2E8F0] shadow-sm cursor-pointer aspect-[4/3] focus-visible:ring-2 focus-visible:ring-[#155EEF]"
    >
      <Image
        src={image.imageUrl}
        alt={image.altText || image.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#10243A]/90 via-[#10243A]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

      {/* Category Pill */}
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-[#10243A]/80 text-[#38BDF8] backdrop-blur-md border border-white/10">
          {image.category}
        </span>
      </div>

      {/* Expand Icon */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 className="w-4 h-4" />
      </div>

      {/* Bottom Title & Details */}
      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
        <h3 className="font-bold text-base leading-snug line-clamp-1 mb-1">
          {image.title}
        </h3>
        {image.caption && (
          <p className="text-xs text-slate-300 line-clamp-1 mb-1.5">
            {image.caption}
          </p>
        )}
        {image.eventDate && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#38BDF8]">
            <Calendar className="w-3 h-3" />
            <span>{image.eventDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
