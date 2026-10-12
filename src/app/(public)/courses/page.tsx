import React from "react";
import type { Metadata } from "next";
import { getPublishedCourses } from "@/lib/db/queries/courses";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CoursesExplorer } from "@/components/courses/CoursesExplorer";

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Biomedical Training Courses | Meddrainn Healthcare",
  description:
    "Explore practical biomedical engineering training programs in equipment calibration, ICU technology, clinical instrumentation, and hospital internships in Erode.",
  alternates: {
    canonical: getAbsoluteUrl("/courses"),
  },
  openGraph: {
    title: "Biomedical Training Courses | Meddrainn Healthcare",
    description:
      "Master hospital equipment calibration, clinical instrumentation, diagnostic circuitry, and medical life-support technology with expert supervision in Erode.",
    url: getAbsoluteUrl("/courses"),
  },
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="flex flex-col w-full pb-20">
      <PageHeader
        badge="Biomedical Curriculum"
        title="Explore Hands-on Biomedical Courses"
        description="Master hospital equipment calibration, clinical instrumentation, diagnostic circuitry, and medical life-support technology with expert supervision."
        breadcrumbs={[{ label: "Courses" }]}
      />

      <section className="py-12 bg-[#F5F8FC]">
        <Container size="wide">
          <CoursesExplorer initialCourses={courses} />
        </Container>
      </section>
    </div>
  );
}
