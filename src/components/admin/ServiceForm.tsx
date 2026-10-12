"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceFormSchema, ServiceFormInput } from "@/lib/validation";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Service } from "@/lib/db/schema";
import { ArrowLeft, Save } from "lucide-react";

interface ServiceFormProps {
  initialData?: Service | null;
  isEditing?: boolean;
}

const APPROVED_ICONS = [
  { value: "Activity", label: "Activity (Pulse / Diagnostic)" },
  { value: "Stethoscope", label: "Stethoscope (Clinical Care)" },
  { value: "GraduationCap", label: "GraduationCap (Academic Internship)" },
  { value: "Wrench", label: "Wrench (Hands-on Calibration)" },
  { value: "Cpu", label: "Cpu (Electronics & Hardware)" },
  { value: "Presentation", label: "Presentation (Seminars & Bootcamps)" },
  { value: "Users", label: "Users (Guest Lectures / Team)" },
  { value: "Compass", label: "Compass (Career Guidance)" },
];

export function ServiceForm({
  initialData,
  isEditing = false,
}: ServiceFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "Activity",
      imageUrl: initialData?.imageUrl || "",
      displayOrder: initialData?.displayOrder || 0,
      status: (initialData?.status as "published" | "draft") || "draft",
    },
  });

  const currentTitle = watch("title");
  const currentSlug = watch("slug");

  const handleTitleBlur = () => {
    if (!isEditing && currentTitle && !currentSlug) {
      const slug = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ServiceFormInput) => {
    try {
      const url = isEditing
        ? `/api/admin/services/${initialData?.id}`
        : "/api/admin/services";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save service");
      }

      showToast(
        isEditing ? "Service updated successfully!" : "Service created successfully!",
        "success"
      );
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save service", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl" noValidate>
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link href="/admin/services">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Services
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#10243A]">
            {isEditing ? "Edit Service" : "Add New Service"}
          </h1>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isEditing ? "Save Changes" : "Create Service"}
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
        <FormField
          label="Service Title"
          required
          htmlFor="title"
          error={errors.title?.message}
        >
          <Input
            id="title"
            placeholder="e.g. Biomedical Equipment Training"
            {...register("title")}
            onBlur={handleTitleBlur}
          />
        </FormField>

        <FormField
          label="Slug (Unique Identifier)"
          required
          htmlFor="slug"
          error={errors.slug?.message}
        >
          <Input
            id="slug"
            placeholder="e.g. biomedical-equipment-training"
            {...register("slug")}
          />
        </FormField>

        <FormField
          label="Service Description"
          required
          htmlFor="description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            rows={3}
            placeholder="Detailed description of the workshop, training, or institutional service..."
            {...register("description")}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Service Icon" htmlFor="icon" error={errors.icon?.message}>
            <Select id="icon" {...register("icon")}>
              {APPROVED_ICONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Display Order"
            htmlFor="displayOrder"
            error={errors.displayOrder?.message}
          >
            <Input
              id="displayOrder"
              type="number"
              {...register("displayOrder")}
            />
          </FormField>
        </div>

        <FormField
          label="Publication Status"
          htmlFor="status"
          error={errors.status?.message}
        >
          <Select id="status" {...register("status")}>
            <option value="draft">Draft (Hidden from public site)</option>
            <option value="published">Published (Visible publicly)</option>
          </Select>
        </FormField>
      </div>
    </form>
  );
}
