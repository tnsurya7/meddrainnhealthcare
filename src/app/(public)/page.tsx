import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { getFeaturedCourses } from "@/lib/db/queries/courses";
import { getPublishedServices } from "@/lib/db/queries/services";
import { getPublishedGalleryImages } from "@/lib/db/queries/gallery";
import { getPublicStudentShowcase } from "@/lib/db/queries/students";
import { getApprovedFeedback } from "@/lib/db/queries/feedback";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { MissionVisionSection } from "@/components/home/MissionVisionSection";
import { FeaturedCoursesSection } from "@/components/home/FeaturedCoursesSection";
import { ServicesPreviewSection } from "@/components/home/ServicesPreviewSection";
import { PracticalLabSection } from "@/components/home/PracticalLabSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { StudentShowcaseSection } from "@/components/home/StudentShowcaseSection";
import { FeedbackPreviewSection } from "@/components/home/FeedbackPreviewSection";
import { HomeContactCta } from "@/components/home/HomeContactCta";
import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60; // ISR cache revalidation

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const canonicalUrl = getAbsoluteUrl("/");

  return {
    title:
      settings.seoTitle ||
      "Meddrainn Healthcare | Biomedical Equipment Training & Hospital Services",
    description:
      settings.seoDescription ||
      "Established in 2021, Meddrainn Healthcare provides hands-on medical equipment training, biomedical internships, college workshops, and healthcare support services in Erode.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title:
        settings.seoTitle ||
        "Meddrainn Healthcare | Practical Biomedical Equipment Training",
      description: settings.seoDescription || settings.aboutContent,
      url: canonicalUrl,
    },
  };
}

export default async function HomePage() {
  const [settings, courses, services, gallery, students, feedback] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedCourses(),
      getPublishedServices(),
      getPublishedGalleryImages(),
      getPublicStudentShowcase(),
      getApprovedFeedback(6),
    ]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero */}
      <HeroSection
        title={settings.heroTitle}
        description={settings.heroDescription}
        heroImageUrl={settings.heroImageUrl}
      />

      {/* 2. About Preview */}
      <AboutPreviewSection aboutContent={settings.aboutContent} />

      {/* 3. Mission & Vision */}
      <MissionVisionSection
        mission={settings.mission}
        vision={settings.vision}
      />

      {/* 4. Featured Courses */}
      <FeaturedCoursesSection courses={courses} />

      {/* 5. Services and Training */}
      <ServicesPreviewSection services={services} />

      {/* 6. Practical Training and Laboratory */}
      <PracticalLabSection />

      {/* 7. Gallery Preview (if enabled) */}
      {settings.publicGalleryVisibility && (
        <GalleryPreviewSection images={gallery} />
      )}

      {/* 8. Student Showcase (if enabled) */}
      <StudentShowcaseSection
        students={students}
        isVisible={settings.studentShowcaseVisibility}
      />

      {/* 9. Feedback Preview */}
      <FeedbackPreviewSection feedback={feedback} />

      {/* 10. Contact / Admission CTA */}
      <HomeContactCta phone={settings.phone} />
    </div>
  );
}
