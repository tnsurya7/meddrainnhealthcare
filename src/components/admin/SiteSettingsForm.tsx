"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsFormSchema, SiteSettingsFormInput } from "@/lib/validation";
import { SiteSettings } from "@/lib/db/schema";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Eye,
  Shield,
  Upload,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({
  initialSettings,
}: SiteSettingsFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormInput>({
    resolver: zodResolver(siteSettingsFormSchema) as any,
    defaultValues: {
      instituteName: initialSettings.instituteName,
      address: initialSettings.address,
      phone: initialSettings.phone,
      email: initialSettings.email,
      instagramUrl: initialSettings.instagramUrl,
      logoUrl: initialSettings.logoUrl || "",
      heroTitle: initialSettings.heroTitle,
      heroDescription: initialSettings.heroDescription,
      heroImageUrl: initialSettings.heroImageUrl || "",
      aboutContent: initialSettings.aboutContent,
      mission: initialSettings.mission,
      vision: initialSettings.vision,
      footerText: initialSettings.footerText,
      seoTitle: initialSettings.seoTitle,
      seoDescription: initialSettings.seoDescription,
      publicGalleryVisibility: initialSettings.publicGalleryVisibility,
      studentShowcaseVisibility: initialSettings.studentShowcaseVisibility,
      privacyPolicyContent: initialSettings.privacyPolicyContent,
    },
  });

  const currentLogo = watch("logoUrl");
  const currentHeroImg = watch("heroImageUrl");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setValue("logoUrl", json.url, { shouldValidate: true });
      showToast("Logo uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload logo", "error");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setValue("heroImageUrl", json.url, { shouldValidate: true });
      showToast("Hero image uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload hero image", "error");
    } finally {
      setIsUploadingHero(false);
    }
  };

  const onSubmit = async (data: SiteSettingsFormInput) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save settings.");

      showToast("Site settings updated and live site revalidated!", "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10243A]">
            Site Settings & Configuration
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Update institute contact info, branding, homepage hero, and public visibility.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Brand & Contact Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Globe className="w-5 h-5 text-[#155EEF]" />
            <h2 className="text-base font-bold text-[#10243A]">
              Brand & Contact Details
            </h2>
          </div>

          <FormField
            label="Institute Name"
            required
            htmlFor="instituteName"
            error={errors.instituteName?.message}
          >
            <Input id="instituteName" {...register("instituteName")} />
          </FormField>

          <FormField
            label="Physical Address"
            required
            htmlFor="address"
            error={errors.address?.message}
          >
            <Textarea rows={2} id="address" {...register("address")} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Phone Number"
              required
              htmlFor="phone"
              error={errors.phone?.message}
            >
              <Input
                id="phone"
                leftIcon={<Phone className="w-4 h-4" />}
                {...register("phone")}
              />
            </FormField>

            <FormField
              label="Contact Email"
              required
              htmlFor="email"
              error={errors.email?.message}
            >
              <Input
                id="email"
                leftIcon={<Mail className="w-4 h-4" />}
                {...register("email")}
              />
            </FormField>
          </div>

          <FormField
            label="Instagram URL (Configurable)"
            required
            htmlFor="instagramUrl"
            error={errors.instagramUrl?.message}
          >
            <Input
              id="instagramUrl"
              leftIcon={<InstagramIcon className="w-4 h-4" />}
              {...register("instagramUrl")}
            />
          </FormField>

          <FormField label="Footer Copyright Text" htmlFor="footerText">
            <Input id="footerText" {...register("footerText")} />
          </FormField>

          <div>
            <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
              Official Logo File:
            </label>
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp"
              onChange={handleLogoUpload}
              disabled={isUploadingLogo}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#eff4ff] file:text-[#155EEF] file:cursor-pointer cursor-pointer"
            />
            {isUploadingLogo && (
              <p className="text-xs text-[#155EEF] animate-pulse mt-1">
                Uploading logo...
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Homepage Hero Content */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Eye className="w-5 h-5 text-[#0D9488]" />
            <h2 className="text-base font-bold text-[#10243A]">
              Homepage Hero Section
            </h2>
          </div>

          <FormField
            label="Hero Headline Title"
            required
            htmlFor="heroTitle"
            error={errors.heroTitle?.message}
          >
            <Input id="heroTitle" {...register("heroTitle")} />
          </FormField>

          <FormField
            label="Hero Introduction Text"
            required
            htmlFor="heroDescription"
            error={errors.heroDescription?.message}
          >
            <Textarea
              rows={3}
              id="heroDescription"
              {...register("heroDescription")}
            />
          </FormField>

          <div>
            <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
              Hero Graphic Image:
            </label>
            {currentHeroImg && (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-[#E2E8F0] mb-2">
                <Image src={currentHeroImg} alt="Hero" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp"
              onChange={handleHeroImageUpload}
              disabled={isUploadingHero}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#eff4ff] file:text-[#155EEF] file:cursor-pointer cursor-pointer"
            />
            {isUploadingHero && (
              <p className="text-xs text-[#155EEF] animate-pulse mt-1">
                Uploading hero graphic...
              </p>
            )}
          </div>
        </div>

        {/* Card 3: About, Mission & Vision */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#10243A] border-b border-[#E2E8F0] pb-3">
            About, Mission & Vision Statements
          </h2>

          <FormField
            label="About the Institute Summary"
            required
            htmlFor="aboutContent"
            error={errors.aboutContent?.message}
          >
            <Textarea
              rows={4}
              id="aboutContent"
              {...register("aboutContent")}
            />
          </FormField>

          <FormField
            label="Mission Statement"
            required
            htmlFor="mission"
            error={errors.mission?.message}
          >
            <Textarea rows={3} id="mission" {...register("mission")} />
          </FormField>

          <FormField
            label="Vision Statement"
            required
            htmlFor="vision"
            error={errors.vision?.message}
          >
            <Textarea rows={3} id="vision" {...register("vision")} />
          </FormField>
        </div>

        {/* Card 4: SEO, Visibility & Privacy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Shield className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-base font-bold text-[#10243A]">
              SEO & Public Visibility Controls
            </h2>
          </div>

          <FormField
            label="Default SEO Title Tag"
            required
            htmlFor="seoTitle"
            error={errors.seoTitle?.message}
          >
            <Input id="seoTitle" {...register("seoTitle")} />
          </FormField>

          <FormField
            label="Default SEO Meta Description"
            required
            htmlFor="seoDescription"
            error={errors.seoDescription?.message}
          >
            <Textarea
              rows={2}
              id="seoDescription"
              {...register("seoDescription")}
            />
          </FormField>

          <div className="p-4 bg-[#F5F8FC] rounded-2xl border border-[#E2E8F0] space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#155EEF] focus:ring-[#155EEF]"
                {...register("publicGalleryVisibility")}
              />
              <span className="text-xs sm:text-sm font-semibold text-[#172B4D]">
                Display Public Photo Gallery Section
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#155EEF] focus:ring-[#155EEF]"
                {...register("studentShowcaseVisibility")}
              />
              <span className="text-xs sm:text-sm font-semibold text-[#172B4D]">
                Display Student Showcase Section (Approved consent records only)
              </span>
            </label>
          </div>

          <FormField
            label="Privacy Policy Body Content"
            required
            htmlFor="privacyPolicyContent"
            error={errors.privacyPolicyContent?.message}
          >
            <Textarea
              rows={4}
              id="privacyPolicyContent"
              {...register("privacyPolicyContent")}
            />
          </FormField>
        </div>
      </div>
    </form>
  );
}
