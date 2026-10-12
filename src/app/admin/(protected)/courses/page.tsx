import React from "react";
import { getAllCoursesAdmin } from "@/lib/db/queries/courses";
import { CoursesManagerTable } from "@/components/admin/CoursesManagerTable";

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
          Course Management
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Create, edit, organize, and publish biomedical training programs.
        </p>
      </div>

      <CoursesManagerTable initialCourses={courses} />
    </div>
  );
}
