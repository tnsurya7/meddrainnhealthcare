import React from "react";
import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/db/queries/courses";
import { CourseForm } from "@/components/admin/CourseForm";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return <CourseForm initialData={course} isEditing={true} />;
}
