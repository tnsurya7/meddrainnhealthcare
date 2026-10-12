import React from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/db/queries/admin-stats";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  Image as ImageIcon,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  Star,
  Wrench,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time institute metrics, active courses, student records, and incoming enquiries.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/admin/courses/new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Course
            </Button>
          </Link>
          <Link href="/admin/enquiries">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              View Enquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Courses */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Courses
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#155EEF] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10243A]">
              {stats.totalCourses}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1">
              <span className="text-emerald-600 font-semibold">{stats.publishedCourses} Pub</span>
              <span>•</span>
              <span className="text-slate-500">{stats.draftCourses} Draft</span>
            </div>
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Services
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0D9488] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10243A]">
              {stats.totalServices}
            </span>
            <div className="text-[11px] text-[#64748B] mt-1">
              <span>Programs active</span>
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Gallery
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10243A]">
              {stats.publishedGalleryImages}
            </span>
            <div className="text-[11px] text-[#64748B] mt-1">
              <span>{stats.totalGalleryItems} total photos</span>
            </div>
          </div>
        </div>

        {/* Student Records */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10243A]">
              {stats.totalStudents}
            </span>
            <div className="text-[11px] text-[#64748B] mt-1">
              <span>Private &amp; Showcase</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Feedback
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10243A]">
              {stats.approvedFeedback}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1">
              <span className="text-amber-600 font-semibold">{stats.pendingFeedback} Pending</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{stats.approvedFeedback} Live</span>
            </div>
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Enquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10243A]">
              {stats.newEnquiriesCount}
            </span>
            <div className="text-[11px] text-[#64748B] mt-1">
              <span>{stats.totalEnquiriesCount} total submitted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enquiry Activity Section */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#10243A]">
              Recent Admission Enquiries
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Latest form submissions from students and institutions
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-[#155EEF] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8FC] text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-3.5">Student / Contact</th>
                  <th className="px-6 py-3.5">Program / Course</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {stats.recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#10243A]">{enquiry.name}</p>
                      <p className="text-xs text-[#64748B]">{enquiry.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-[#172B4D] bg-slate-100 px-2.5 py-1 rounded-md">
                        {enquiry.courseOfInterest || "General Enquiry"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          enquiry.status === "new"
                            ? "bg-amber-100 text-amber-800"
                            : enquiry.status === "contacted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {enquiry.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#64748B]">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/enquiries?id=${enquiry.id}`}
                        className="text-xs font-bold text-[#155EEF] hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-[#64748B] text-sm">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>No admission enquiries received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
