"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Upload,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

const CATEGORIES = [
  "Workshops",
  "Seminars",
  "Student Training",
  "Biomedical Equipment",
  "Laboratory Activities",
  "Institute Events",
];

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  // New Image form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState(CATEGORIES[0]);
  const [uploadEventDate, setUploadEventDate] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"published" | "draft">("published");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [storageKey, setStorageKey] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instantly generate client-side preview URL so preview is immediately visible
    const previewObjectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewObjectUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "gallery-images");

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "File upload failed.");
      }

      setUploadedUrl(json.url);
      setStorageKey(json.key || "");
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
      showToast("Photo uploaded successfully! Preview ready.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload photo", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl || !uploadTitle) {
      showToast("Please provide a photo and a title.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: uploadTitle,
        caption: uploadCaption,
        category: uploadCategory,
        imageUrl: uploadedUrl,
        storageKey,
        eventDate: uploadEventDate,
        status: uploadStatus,
        displayOrder: images.length + 1,
      };

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save gallery photo.");
      }

      setImages((prev) => [json.image, ...prev]);
      showToast("Gallery item added successfully!", "success");
      setIsUploadOpen(false);

      // Reset form
      setUploadTitle("");
      setUploadCaption("");
      setUploadEventDate("");
      setUploadedUrl("");
      setLocalPreviewUrl("");
      setStorageKey("");
    } catch (err: any) {
      showToast(err.message || "Failed to save photo record", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (image: GalleryImage) => {
    const newStatus = image.status === "published" ? "draft" : "published";

    // Optimistic UI update for instantaneous responsiveness
    setImages((prev) =>
      prev.map((item) =>
        item.id === image.id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const res = await fetch(`/api/admin/gallery/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      showToast(
        `Image ${newStatus === "published" ? "published" : "moved to draft"}.`,
        "success"
      );
    } catch {
      // Revert if API fails
      setImages((prev) =>
        prev.map((item) =>
          item.id === image.id ? { ...item, status: image.status } : item
        )
      );
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete photo");

      setImages((prev) => prev.filter((item) => item.id !== deletingId));
      showToast("Photo removed from gallery.", "success");
      setDeletingId(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete photo", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          {images.length} photos in gallery ({images.filter((i) => i.status === "published").length} published)
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Upload New Photo
        </Button>
      </div>

      {/* Grid of Gallery Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full bg-[#10243A]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#10243A]/85 text-[#38BDF8] backdrop-blur-md border border-white/10">
                  {image.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => handleTogglePublish(image)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${image.status === "published"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-700 text-slate-200"
                    }`}
                  title="Click to toggle publish status"
                >
                  {image.status.toUpperCase()}
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-[#10243A] text-sm line-clamp-1 mb-1">
                {image.title}
              </h3>
              {image.caption && (
                <p className="text-xs text-[#64748B] line-clamp-2 mb-2">
                  {image.caption}
                </p>
              )}
              {image.eventDate && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#0D9488] font-medium mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{image.eventDate}</span>
                </div>
              )}

              <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(image)}
                  className="text-xs font-semibold text-[#155EEF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {image.status === "published" ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Publish</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDeletingId(image.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Photo Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload & Add Gallery Photo"
        maxWidth="md"
      >
        <form onSubmit={handleSavePhoto} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
              Choose Image File (JPEG, PNG, WebP, SVG, max 5MB):
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#eff4ff] file:text-[#155EEF] hover:file:bg-[#155EEF] hover:file:text-white file:transition-colors file:cursor-pointer cursor-pointer"
            />
            {isUploading && (
              <p className="text-xs text-[#155EEF] animate-pulse mt-1.5">
                Uploading photo to object storage...
              </p>
            )}
          </div>

          {(localPreviewUrl || uploadedUrl) && (
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-[#E2E8F0] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={localPreviewUrl || uploadedUrl}
                alt="Upload preview"
                className="max-h-full max-w-full object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white text-[#155EEF] px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-pulse">
                    <Upload className="w-4 h-4 animate-bounce" />
                    <span>Uploading to Storage...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <FormField label="Photo Title" required>
            <Input
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Hands-on Patient Monitor Calibration"
              required
            />
          </FormField>

          <FormField label="Category" required>
            <Select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Caption / Description">
            <Textarea
              rows={2}
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="Brief context about this equipment or workshop activity..."
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Event Date">
              <Input
                type="date"
                value={uploadEventDate}
                onChange={(e) => setUploadEventDate(e.target.value)}
              />
            </FormField>

            <FormField label="Initial Status">
              <Select
                value={uploadStatus}
                onChange={(e) =>
                  setUploadStatus(e.target.value as "published" | "draft")
                }
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={(!uploadedUrl && !localPreviewUrl) || isUploading || isSaving}
              isLoading={isSaving}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              {isSaving ? "Saving..." : "Save to Gallery"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Gallery Photo"
        message="Are you sure you want to delete this photo? Associated files will be removed from object storage."
        confirmLabel="Delete Photo"
        isLoading={isDeleting}
      />
    </div>
  );
}
