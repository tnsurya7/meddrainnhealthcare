import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/db/schema";
import { Clock, GraduationCap, ArrowRight, MessageSquareQuote } from "lucide-react";
import { Button } from "./Button";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const thumbUrl =
    course.thumbnailUrl ||
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md hover:border-[#155EEF]/40 transition-all duration-300 group">
      {/* Course Thumbnail */}
      <div className="relative aspect-[16/10] w-full bg-[#10243A] overflow-hidden">
        <Image
          src={thumbUrl}
          alt={course.imageAlt || course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#10243A]/85 text-[#38BDF8] backdrop-blur-md border border-white/10">
            {course.category}
          </span>
        </div>
        {course.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-[#0D9488] text-white shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Course Details Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#10243A] group-hover:text-[#155EEF] transition-colors leading-snug mb-2.5 line-clamp-2">
          <Link href={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>

        <p className="text-sm text-[#64748B] line-clamp-3 mb-4 leading-relaxed">
          {course.shortDescription}
        </p>

        {/* Metadata badges (only displayed if available) */}
        <div className="space-y-2 mb-6 mt-auto pt-2 border-t border-[#F1F5F9]">
          {course.duration && (
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Clock className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
              <span>
                <strong className="text-[#172B4D]">Duration:</strong> {course.duration}
              </span>
            </div>
          )}
          {course.eligibility && (
            <div className="flex items-start gap-2 text-xs text-[#64748B]">
              <GraduationCap className="w-3.5 h-3.5 text-[#0D9488] shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                <strong className="text-[#172B4D]">Eligibility:</strong> {course.eligibility}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link href={`/courses/${course.slug}`} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Details
            </Button>
          </Link>
          <Link
            href={`/contact?course=${encodeURIComponent(course.title)}`}
            className="w-full"
          >
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              leftIcon={<MessageSquareQuote className="w-3.5 h-3.5" />}
            >
              Enquire
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
