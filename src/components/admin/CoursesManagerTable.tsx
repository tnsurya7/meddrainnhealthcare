"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface CoursesManagerTableProps {
  initialCourses: Course[];
}

export function CoursesManagerTable({
  initialCourses,
}: CoursesManagerTableProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  const handleDeleteConfirm = async () => {
    if (!deletingCourseId) return;

    const targetId = deletingCourseId;
    const previousCourses = courses;

    // Optimistically update list for instantaneous UI responsiveness
    setCourses((prev) => prev.filter((c) => c.id !== targetId));
    setDeletingCourseId(null);
    showToast("Course deleted successfully.", "success");

    try {
      const res = await fetch(`/api/admin/courses/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setCourses(previousCourses);
        const json = await res.json();
        throw new Error(json.error || "Failed to delete course.");
      }
    } catch (err: any) {
      setCourses(previousCourses);
      showToast(err.message || "Failed to delete course.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <Link href="/admin/courses/new">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Course
          </Button>
        </Link>
      </div>

      {/* Courses Responsive Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F8FC] text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#10243A] shrink-0">
                        {course.thumbnailUrl && (
                          <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#10243A] line-clamp-1">
                            {course.title}
                          </p>
                          {course.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#155EEF]">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] font-mono mt-0.5">
                          /courses/{course.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-[#172B4D]">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        course.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {course.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#64748B]">
                    #{course.displayOrder}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {course.status === "published" && (
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="p-2 text-slate-500 hover:text-[#155EEF] hover:bg-slate-100 rounded-lg"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-2 text-slate-500 hover:text-[#155EEF] hover:bg-slate-100 rounded-lg"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingCourseId(course.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog for Safe Course Deletion */}
      <ConfirmationDialog
        isOpen={Boolean(deletingCourseId)}
        onClose={() => setDeletingCourseId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to permanently delete this course? This action cannot be undone."
        confirmLabel="Delete Course"
        isLoading={isDeleting}
        isDestructive
      />
    </div>
  );
}
