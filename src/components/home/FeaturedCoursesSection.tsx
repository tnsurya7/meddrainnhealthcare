import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { CourseCard } from "../ui/CourseCard";
import { Button } from "../ui/Button";
import { Course } from "@/lib/db/schema";
import { ArrowRight } from "lucide-react";

interface FeaturedCoursesProps {
  courses: Course[];
}

export function FeaturedCoursesSection({ courses }: FeaturedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-[#E2E8F0]">
      <Container size="wide">
        <SectionHeading
          badge="Specialized Programs"
          title="Featured Biomedical Training Courses"
          description="Structured hands-on courses engineered to develop practical diagnostics, calibration skills, and hospital technology troubleshooting competence."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/courses">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse All Courses
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
