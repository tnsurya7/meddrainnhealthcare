"use client";

import React, { useState } from "react";
import { Enquiry } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";
import {
  MessageSquare,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Edit,
  User,
} from "lucide-react";

interface EnquiriesManagerProps {
  initialEnquiries: Enquiry[];
  totalCount: number;
}

export function EnquiriesManager({
  initialEnquiries,
}: EnquiriesManagerProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editStatus, setEditStatus] = useState<"new" | "contacted" | "resolved">("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus =
      statusFilter === "All" || e.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      (e.courseOfInterest && e.courseOfInterest.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (item: Enquiry) => {
    setSelectedEnquiry(item);
    setEditStatus(item.status as any);
    setAdminNotes(item.adminNotes || "");
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update enquiry.");

      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? json.enquiry : e))
      );
      showToast("Enquiry updated successfully.", "success");
      setSelectedEnquiry(null);
    } catch (err: any) {
      showToast(err.message || "Failed to update enquiry", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const targetId = deletingId;
    const prevEnquiries = enquiries;

    // Optimistic delete for instant response
    setEnquiries((prev) => prev.filter((e) => e.id !== targetId));
    if (selectedEnquiry?.id === targetId) setSelectedEnquiry(null);
    setDeletingId(null);
    showToast("Enquiry deleted.", "success");

    try {
      const res = await fetch(`/api/admin/enquiries/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete enquiry");
    } catch (err: any) {
      setEnquiries(prevEnquiries);
      showToast(err.message || "Failed to delete enquiry", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search by student name, phone, or email..."
            value={search}
            onChange={(e) => setSearch({ ...e }.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </Select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F8FC] text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Student Contact</th>
                <th className="px-6 py-4">Program / Topic</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredEnquiries.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleOpenDetail(enquiry)}
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#10243A]">{enquiry.name}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{enquiry.phone}</p>
                    <p className="text-xs text-[#64748B] truncate max-w-xs">
                      {enquiry.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#eff4ff] text-[#155EEF]">
                      {enquiry.courseOfInterest || "General Enquiry"}
                    </span>
                    {enquiry.subject && (
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
                        {enquiry.subject}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
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
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(enquiry)}
                      >
                        Details
                      </Button>
                      <button
                        onClick={() => setDeletingId(enquiry.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Enquiry"
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

      {/* Enquiry Detail & Internal Notes Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={Boolean(selectedEnquiry)}
          onClose={() => setSelectedEnquiry(null)}
          title="Admission Enquiry Details"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="p-4 bg-[#F5F8FC] rounded-2xl border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-[#10243A]">
                  {selectedEnquiry.name}
                </span>
                <span className="text-xs text-[#64748B]">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#172B4D] pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#155EEF]" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#0D9488]" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </span>
              </div>
              {selectedEnquiry.courseOfInterest && (
                <div className="text-xs text-[#155EEF] font-semibold pt-1">
                  Program: {selectedEnquiry.courseOfInterest}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Message Content:
              </span>
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] text-sm text-[#172B4D] leading-relaxed whitespace-pre-line">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Admin Status & Notes */}
            <div className="space-y-4 pt-2 border-t border-[#E2E8F0]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] mb-1">
                    Enquiry Status:
                  </label>
                  <Select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                  >
                    <option value="new">New (Unattended)</option>
                    <option value="contacted">Contacted (In discussion)</option>
                    <option value="resolved">Resolved (Admitted / Closed)</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Internal Administrative Notes (Private - Never public):
                </label>
                <Textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Called student on 12th Oct, interested in weekend calibration batch..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeletingId(selectedEnquiry.id)}
              >
                Delete Enquiry
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveNotes}
                  isLoading={isUpdating}
                >
                  Save Status & Notes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry record? This cannot be undone."
        confirmLabel="Delete Enquiry"
        isLoading={isDeleting}
      />
    </div>
  );
}
