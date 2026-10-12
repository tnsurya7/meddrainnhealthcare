"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseFormSchema, CourseFormInput } from "@/lib/validation";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Course } from "@/lib/db/schema";
import {
  Upload,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Eye,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface CourseFormProps {
  initialData?: Course | null;
  isEditing?: boolean;
}

export function CourseForm({
  initialData,
  isEditing = false,
}: CourseFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState("");

  // Curriculum modules state
  interface ModItem {
    module: string;
    topics: string[];
  }

  const initialModules: ModItem[] = Array.isArray(initialData?.curriculum)
    ? (initialData.curriculum as any[]).map((m) =>
        typeof m === "string"
          ? { module: m, topics: [] }
          : { module: m.module || "", topics: m.topics || [] }
      )
    : [
        {
          module: "Module 1: Foundations & Equipment Overview",
          topics: ["Core principles", "Instrumentation setup"],
        },
      ];

  const [modules, setModules] = useState<ModItem[]>(initialModules);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseFormSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      category: initialData?.category || "Equipment Calibration",
      duration: initialData?.duration || "6 Weeks",
      eligibility:
        initialData?.eligibility ||
        "B.E/B.Tech Biomedical, Diploma, or Life Sciences",
      prerequisites: initialData?.prerequisites || "Basic electronics knowledge",
      thumbnailUrl:
        initialData?.thumbnailUrl || "/images/courses/calibration.svg",
      imageAlt: initialData?.imageAlt || "",
      featured: initialData?.featured || false,
      status: (initialData?.status as "published" | "draft") || "draft",
      displayOrder: initialData?.displayOrder || 0,
      curriculum: initialModules,
    },
  });

  const currentTitle = watch("title");
  const currentSlug = watch("slug");
  const currentThumbnail = watch("thumbnailUrl");

  // Auto-generate slug when title changes (if not manually editing existing slug)
  const handleTitleBlur = () => {
    if (!isEditing && currentTitle && !currentSlug) {
      const generated = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generated, { shouldValidate: true });
    }
  };

  // Image upload handler
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    setLocalPreview(URL.createObjectURL(file));

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "course-images");

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Image upload failed");
      }

      setValue("thumbnailUrl", json.url, { shouldValidate: true });
      showToast("Course image uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Curriculum module helpers
  const addModule = () => {
    setModules((prev) => [
      ...prev,
      { module: `Module ${prev.length + 1}: `, topics: ["Topic 1"] },
    ]);
  };

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const updateModuleName = (index: number, name: string) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[index].module = name;
      return copy;
    });
  };

  const addTopic = (modIdx: number) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[modIdx].topics.push("New Topic");
      return copy;
    });
  };

  const updateTopicName = (modIdx: number, topicIdx: number, text: string) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[modIdx].topics[topicIdx] = text;
      return copy;
    });
  };

  const removeTopic = (modIdx: number, topicIdx: number) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[modIdx].topics = copy[modIdx].topics.filter((_, i) => i !== topicIdx);
      return copy;
    });
  };

  const onSubmit = async (data: CourseFormInput) => {
    try {
      const payload = {
        ...data,
        curriculum: modules,
      };

      const url = isEditing
        ? `/api/admin/courses/${initialData?.id}`
        : "/api/admin/courses";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save course.");
      }

      showToast(
        isEditing ? "Course updated successfully!" : "Course created successfully!",
        "success"
      );

      router.push("/admin/courses");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "An error occurred while saving.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Courses
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#10243A]">
            {isEditing ? "Edit Course" : "Create New Course"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && initialData?.slug && (
            <Link
              href={`/courses/${initialData.slug}`}
              target="_blank"
              className="hidden sm:inline-block"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Eye className="w-4 h-4" />}
              >
                Preview Public
              </Button>
            </Link>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEditing ? "Save Changes" : "Publish Course"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h2 className="text-base font-bold text-[#10243A] border-b border-[#E2E8F0] pb-3">
              General Information
            </h2>

            {/* Title */}
            <FormField
              label="Course Title"
              required
              htmlFor="title"
              error={errors.title?.message}
            >
              <Input
                id="title"
                placeholder="e.g. Biomedical Equipment Calibration & Safety Testing"
                {...register("title")}
                onBlur={handleTitleBlur}
              />
            </FormField>

            {/* Slug */}
            <FormField
              label="URL Slug (Permanent Link)"
              required
              htmlFor="slug"
              error={errors.slug?.message}
              helperText="Only lowercase alphanumeric characters and hyphens."
            >
              <Input
                id="slug"
                placeholder="e.g. biomedical-equipment-calibration-safety-testing"
                {...register("slug")}
              />
            </FormField>

            {/* Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Category"
                required
                htmlFor="category"
                error={errors.category?.message}
              >
                <Input
                  id="category"
                  placeholder="e.g. Equipment Calibration, Diagnostics, ICU"
                  {...register("category")}
                />
              </FormField>

              <FormField
                label="Duration"
                htmlFor="duration"
                error={errors.duration?.message}
              >
                <Input
                  id="duration"
                  placeholder="e.g. 6 Weeks, 1 Month, 15 Days"
                  {...register("duration")}
                />
              </FormField>
            </div>

            {/* Short Description */}
            <FormField
              label="Short Description (Card Summary)"
              required
              htmlFor="shortDescription"
              error={errors.shortDescription?.message}
              helperText="Brief 1-2 sentence preview shown on course cards."
            >
              <Textarea
                id="shortDescription"
                rows={2}
                placeholder="Brief summary of what this course delivers..."
                {...register("shortDescription")}
              />
            </FormField>

            {/* Detailed Description */}
            <FormField
              label="Full Course Description"
              required
              htmlFor="description"
              error={errors.description?.message}
            >
              <Textarea
                id="description"
                rows={5}
                placeholder="In-depth details of laboratory equipment, clinical scope, and methodology..."
                {...register("description")}
              />
            </FormField>
          </div>

          {/* Curriculum Builder */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-base font-bold text-[#10243A]">
                Structured Curriculum Modules
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addModule}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Module
              </Button>
            </div>

            <div className="space-y-4">
              {modules.map((mod, modIdx) => (
                <div
                  key={modIdx}
                  className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={mod.module}
                      onChange={(e) => updateModuleName(modIdx, e.target.value)}
                      placeholder="Module title (e.g. Module 1: Pneumatics)"
                      className="font-bold text-[#10243A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeModule(modIdx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Remove Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Topics List */}
                  <div className="pl-4 space-y-2 border-l-2 border-[#155EEF]/30">
                    {mod.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} className="flex items-center gap-2">
                        <Input
                          value={topic}
                          onChange={(e) =>
                            updateTopicName(modIdx, topicIdx, e.target.value)
                          }
                          placeholder="Topic / practical task item"
                          className="text-xs sm:text-sm py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() => removeTopic(modIdx, topicIdx)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTopic(modIdx)}
                      className="text-xs font-semibold text-[#155EEF] hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Topic Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Status, Media, and Eligibility */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Status Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#10243A] border-b border-[#E2E8F0] pb-2">
              Publishing Options
            </h3>

            <FormField label="Publication Status" htmlFor="status">
              <Select id="status" {...register("status")}>
                <option value="draft">Draft (Private, not public)</option>
                <option value="published">Published (Visible on website)</option>
              </Select>
            </FormField>

            <FormField label="Display Order" htmlFor="displayOrder">
              <Input
                id="displayOrder"
                type="number"
                {...register("displayOrder")}
              />
            </FormField>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#155EEF] focus:ring-[#155EEF]"
                  {...register("featured")}
                />
                <span className="text-sm font-semibold text-[#172B4D]">
                  Feature on Homepage
                </span>
              </label>
            </div>
          </div>

          {/* Thumbnail Image Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#10243A] border-b border-[#E2E8F0] pb-2">
              Course Thumbnail
            </h3>

            {(localPreview || currentThumbnail) && (
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#10243A] border border-[#E2E8F0] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={localPreview || currentThumbnail}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <FormField label="Image URL or Asset Path" htmlFor="thumbnailUrl">
                <Input
                  id="thumbnailUrl"
                  placeholder="/images/courses/calibration.svg"
                  {...register("thumbnailUrl")}
                />
              </FormField>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Upload New Image File:
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleImageFileChange}
                  disabled={isUploading}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#eff4ff] file:text-[#155EEF] hover:file:bg-[#155EEF] hover:file:text-white file:transition-colors file:cursor-pointer cursor-pointer"
                />
                {isUploading && (
                  <p className="text-xs text-[#155EEF] animate-pulse mt-1">
                    Uploading image to storage...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Requirements Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#10243A] border-b border-[#E2E8F0] pb-2">
              Eligibility & Prerequisites
            </h3>

            <FormField
              label="Student Eligibility"
              htmlFor="eligibility"
              error={errors.eligibility?.message}
            >
              <Input
                id="eligibility"
                placeholder="e.g. B.E/B.Tech Biomedical, Diploma"
                {...register("eligibility")}
              />
            </FormField>

            <FormField
              label="Course Prerequisites"
              htmlFor="prerequisites"
              error={errors.prerequisites?.message}
            >
              <Input
                id="prerequisites"
                placeholder="e.g. Basic analog circuit fundamentals"
                {...register("prerequisites")}
              />
            </FormField>
          </div>
        </div>
      </div>
    </form>
  );
}
