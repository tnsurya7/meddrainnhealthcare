"use client";

import React, { useState, useMemo } from "react";
import { GalleryImage } from "@/lib/db/schema";
import { GalleryCard } from "../ui/GalleryCard";
import { GalleryLightbox } from "../ui/GalleryLightbox";
import { EmptyState } from "../ui/EmptyState";
import { Image as ImageIcon } from "lucide-react";

interface GalleryExplorerProps {
  initialImages: GalleryImage[];
}

const CLIENT_CATEGORIES = [
  "All",
  "Workshop Training",
  "Seminars",
  "Medical Devices",
  "Biomedical Devices",
  "College",
  "Medical Coding",
  "Internship Training",
  "Practical Training",
  "Events",
];

export function GalleryExplorer({ initialImages }: GalleryExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const presentCats = Array.from(new Set(initialImages.map((img) => img.category).filter(Boolean)));
    const merged = Array.from(new Set([...CLIENT_CATEGORIES, ...presentCats]));
    return merged;
  }, [initialImages]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return initialImages;
    return initialImages.filter((img) => img.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [initialImages, selectedCategory]);

  const handleOpenLightbox = (image: GalleryImage) => {
    const idx = filteredImages.findIndex((img) => img.id === image.id);
    setActiveImageIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-[#155EEF] text-white shadow-sm"
                : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F5F8FC] hover:text-[#10243A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <GalleryCard
              key={image.id}
              image={image}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ImageIcon className="w-7 h-7" />}
          title="No images found in this category"
          description="Check back soon or select another category to view photos from our training labs."
          actionLabel="View All Photos"
          onAction={() => setSelectedCategory("All")}
        />
      )}

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={filteredImages}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveImageIndex(newIdx)}
      />
    </div>
  );
}
