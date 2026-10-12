"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Student } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Plus,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";

interface AdminStudentItem extends Student {
  courseTitle?: string | null;
}

interface StudentsManagerProps {
  initialStudents: AdminStudentItem[];
  coursesList: { id: string; title: string }[];
}

export function StudentsManager({
  initialStudents,
  coursesList,
}: StudentsManagerProps) {
  const [students, setStudents] = useState<AdminStudentItem[]>(initialStudents);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  // Form states
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("2025-2026");
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [localPhotoPreview, setLocalPhotoPreview] = useState("");
  const [consentStatus, setConsentStatus] = useState(false);
  const [status, setStatus] = useState<"published" | "private">("private");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    setLocalPhotoPreview(URL.createObjectURL(file));

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "student-photos");

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setPhotoUrl(json.url);
      showToast("Student photo uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload photo", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !batch) {
      showToast("Student name and batch are required.", "error");
      return;
    }

    try {
      const payload = {
        name,
        batch,
        courseId: courseId || undefined,
        description,
        photoUrl,
        consentStatus,
        status,
      };

      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add student record.");

      const selectedCourse = coursesList.find((c) => c.id === courseId);
      const newRecord: AdminStudentItem = {
        ...json.student,
        courseTitle: selectedCourse?.title || null,
      };

      setStudents((prev) => [newRecord, ...prev]);
      showToast("Student record created successfully!", "success");
      setIsAddOpen(false);

      // Reset
      setName("");
      setDescription("");
      setPhotoUrl("");
      setConsentStatus(false);
      setStatus("private");
    } catch (err: any) {
      showToast(err.message || "Failed to create student", "error");
    }
  };

  const handleTogglePublish = async (student: AdminStudentItem) => {
    if (student.status === "private" && !student.consentStatus) {
      showToast(
        "Cannot publish student showcase without documented consent.",
        "error"
      );
      return;
    }

    const newStatus = student.status === "published" ? "private" : "published";
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s))
      );
      showToast(
        `Record ${newStatus === "published" ? "published to showcase" : "marked private"}.`,
        "success"
      );
    } catch {
      showToast("Failed to update student visibility", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const targetId = deletingId;
    const prevStudents = students;

    // Optimistic delete for instant UI responsiveness
    setStudents((prev) => prev.filter((s) => s.id !== targetId));
    setDeletingId(null);
    showToast("Student record deleted.", "success");

    try {
      const res = await fetch(`/api/admin/students/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete record");
    } catch (err: any) {
      setStudents(prevStudents);
      showToast(err.message || "Failed to delete student", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          {students.length} total student records (Private by default)
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Student Record
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F8FC] text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Consent Status</th>
                <th className="px-6 py-4">Showcase Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#10243A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {student.photoUrl ? (
                          <Image
                            src={student.photoUrl}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span>{student.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#10243A]">{student.name}</p>
                        {student.description && (
                          <p className="text-xs text-[#64748B] line-clamp-1 max-w-xs">
                            {student.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-[#172B4D]">
                    {student.batch}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#64748B]">
                    {student.courseTitle || "General Biomedical Program"}
                  </td>
                  <td className="px-6 py-4">
                    {student.consentStatus ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Consent Granted</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>No Consent</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(student)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        student.status === "published"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Click to toggle showcase visibility"
                    >
                      {student.status === "published" ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Showcase Public</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Private</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setDeletingId(student.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Private Student Record"
        maxWidth="md"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <FormField label="Student Full Name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sundaram"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Academic Batch" required>
              <Input
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="e.g. 2025-2026"
                required
              />
            </FormField>

            <FormField label="Associated Course">
              <Select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select course (optional)</option>
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Achievement / Description">
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional project title, achievement, or clinical placement note..."
            />
          </FormField>

          <div>
            <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
              Upload Student Photo (Optional):
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              disabled={isUploading}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#eff4ff] file:text-[#155EEF] file:cursor-pointer cursor-pointer"
            />
            {isUploading && (
              <p className="text-xs text-[#155EEF] animate-pulse mt-1">
                Uploading photo...
              </p>
            )}
          </div>

          {(localPhotoPreview || photoUrl) && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={localPhotoPreview || photoUrl}
                  alt="Student Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-emerald-600 font-semibold">
                Photo ready
              </span>
            </div>
          )}

          {/* Privacy & Consent Requirements */}
          <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentStatus}
                onChange={(e) => setConsentStatus(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#155EEF] focus:ring-[#155EEF]"
              />
              <span className="text-xs text-[#172B4D] leading-relaxed">
                <strong>Documented Consent Obtained:</strong> Student has provided
                explicit consent for public showcase participation.
              </span>
            </label>

            <FormField label="Initial Visibility">
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "published" | "private")
                }
              >
                <option value="private">Private (Default - hidden from public)</option>
                <option value="published" disabled={!consentStatus}>
                  Published Showcase {!consentStatus ? "(Requires consent)" : ""}
                </option>
              </Select>
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Student Record
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message="Are you sure you want to delete this student record? This action cannot be undone."
        confirmLabel="Delete Record"
        isLoading={isDeleting}
      />
    </div>
  );
}
