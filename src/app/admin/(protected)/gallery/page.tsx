import React from "react";
import { getAllGalleryImagesAdmin } from "@/lib/db/queries/gallery";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const images = await getAllGalleryImagesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
          Gallery Management
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Upload laboratory photos, manage workshop archives, edit captions, and control public visibility.
        </p>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
