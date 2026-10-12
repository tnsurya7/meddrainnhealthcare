"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/db/schema";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % images.length);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close Lightbox"
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={() =>
            onNavigate((currentIndex - 1 + images.length) % images.length)
          }
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
        <div className="relative w-full h-[65vh] sm:h-[70vh]">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.altText || currentImage.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Captions and Info */}
        <div className="mt-4 text-center text-white max-w-2xl px-4">
          <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-[#155EEF] text-white mb-2">
            {currentImage.category}
          </div>
          <h3 className="text-lg sm:text-xl font-bold">{currentImage.title}</h3>
          {currentImage.caption && (
            <p className="mt-1 text-sm text-slate-300">
              {currentImage.caption}
            </p>
          )}
          {currentImage.eventDate && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#38BDF8]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Event Date: {currentImage.eventDate}</span>
            </div>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
