import React from "react";
import { getAllStudentsAdmin } from "@/lib/db/queries/students";
import { getAllCoursesAdmin } from "@/lib/db/queries/courses";
import { StudentsManager } from "@/components/admin/StudentsManager";

export default async function AdminStudentsPage() {
  const [students, courses] = await Promise.all([
    getAllStudentsAdmin(),
    getAllCoursesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
          Student Records & Showcase
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Maintain private trainee records and manage opt-in public showcase permissions with verified consent.
        </p>
      </div>

      <StudentsManager
        initialStudents={students}
        coursesList={courses.map((c) => ({ id: c.id, title: c.title }))}
      />
    </div>
  );
}
