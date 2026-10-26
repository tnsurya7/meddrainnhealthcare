import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCourseBySlug, getPublishedCourses } from "@/lib/db/queries/courses";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  MessageSquareQuote,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

import { getAbsoluteUrl } from "@/lib/seo/site-url";
import {
  generateCourseSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | Meddrainn Healthcare",
    };
  }

  const canonicalUrl = getAbsoluteUrl(`/courses/${course.slug}`);

  return {
    title: course.title,
    description: course.shortDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${course.title} | Meddrainn Healthcare`,
      description: course.shortDescription,
      url: canonicalUrl,
      images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : undefined,
    },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  // Safe slug sanitization
  const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");
  const course = await getCourseBySlug(cleanSlug);

  if (!course) {
    notFound();
  }

  const thumbUrl =
    course.thumbnailUrl ||
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80";

  // Parse curriculum safely (could be array of objects or strings)
  interface CurriculumModule {
    module: string;
    topics: string[];
  }
  let curriculumModules: CurriculumModule[] = [];
  if (Array.isArray(course.curriculum)) {
    curriculumModules = (course.curriculum as any[]).map((item) => {
      if (typeof item === "string") {
        return { module: item, topics: [] };
      }
      return {
        module: item.module || "Course Module",
        topics: Array.isArray(item.topics) ? item.topics : [],
      };
    });
  }

  const courseSchema = generateCourseSchema({
    title: course.title,
    description: course.description,
    slug: course.slug,
    duration: course.duration,
    prerequisites: course.prerequisites,
    thumbnailUrl: thumbUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    { name: course.title, url: `/courses/${course.slug}` },
  ]);

  return (
    <div className="flex flex-col w-full pb-20">
      <JsonLd data={[courseSchema, breadcrumbSchema]} />
      <PageHeader
        badge={course.category}
        title={course.title}
        description={course.shortDescription}
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: course.title },
        ]}
      />

      <section className="py-12 bg-[#F5F8FC]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Course Description & Curriculum */}
            <div className="lg:col-span-8 space-y-8">
              {/* Main Course Hero Image */}
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#10243A] border border-[#E2E8F0] shadow-sm">
                <Image
                  src={thumbUrl}
                  alt={course.imageAlt || course.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Course Overview */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#10243A]">
                  Course Overview
                </h2>
                <div className="text-sm sm:text-base text-[#64748B] leading-relaxed whitespace-pre-line">
                  {course.description}
                </div>
              </div>

              {/* Curriculum Breakdown (if provided) */}
              {curriculumModules.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#155EEF]" />
                    <h2 className="text-xl sm:text-2xl font-bold text-[#10243A]">
                      Curriculum & Practical Syllabus
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {curriculumModules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#E2E8F0] space-y-3"
                      >
                        <h3 className="font-bold text-base text-[#10243A]">
                          {mod.module}
                        </h3>
                        {mod.topics.length > 0 && (
                          <ul className="space-y-2 pt-1 border-t border-[#E2E8F0]">
                            {mod.topics.map((topic, tIdx) => (
                              <li
                                key={tIdx}
                                className="flex items-start gap-2 text-xs sm:text-sm text-[#172B4D]"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Facts Card & Action Sticky Bar */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-md space-y-6">
                <h3 className="text-lg font-bold text-[#10243A] pb-3 border-b border-[#E2E8F0]">
                  Course Specifications
                </h3>

                {/* Metadata List - Only display fields if available */}
                <div className="space-y-4">
                  {course.duration && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#155EEF] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-[#64748B] block font-medium">
                          Duration
                        </span>
                        <span className="text-sm font-bold text-[#10243A]">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  )}

                  {course.eligibility && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f0fdfa] text-[#0D9488] flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-[#64748B] block font-medium">
                          Eligibility
                        </span>
                        <span className="text-sm font-bold text-[#10243A]">
                          {course.eligibility}
                        </span>
                      </div>
                    </div>
                  )}

                  {course.prerequisites && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#38BDF8] flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-[#64748B] block font-medium">
                          Prerequisites
                        </span>
                        <span className="text-sm font-bold text-[#10243A]">
                          {course.prerequisites}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#172B4D] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#64748B] block font-medium">
                        Learning Mode
                      </span>
                      <span className="text-sm font-bold text-[#10243A]">
                        100% Practical In-Person Laboratory
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preselected Contact CTA */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                  <Link
                    href={`/contact?course=${encodeURIComponent(course.title)}`}
                    className="w-full block"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full justify-center shadow-md shadow-[#155EEF]/20"
                      leftIcon={<MessageSquareQuote className="w-4 h-4" />}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Contact About This Course
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-[#64748B]">
                    Batch admissions confirmed upon laboratory seat allocation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
