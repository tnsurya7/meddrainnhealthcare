"use client";

import React, { useState } from "react";
import { Feedback } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Star,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Filter,
} from "lucide-react";

interface FeedbackManagerProps {
  initialFeedback: Feedback[];
  totalCount: number;
}

export function FeedbackManager({
  initialFeedback,
}: FeedbackManagerProps) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(initialFeedback);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const filteredItems = feedbackList.filter((item) => {
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    const matchesRating =
      ratingFilter === "All" || item.rating === parseInt(ratingFilter, 10);
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q);

    return matchesStatus && matchesRating && matchesSearch;
  });

  const handleUpdateStatus = async (
    id: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    const prevList = feedbackList;
    const statusLabels = {
      approved: "Feedback approved and published.",
      rejected: "Feedback rejected.",
      pending: "Feedback set back to pending review.",
    };

    // Optimistic UI update
    setFeedbackList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(statusLabels[newStatus], "success");

    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update feedback status.");
    } catch (err: any) {
      setFeedbackList(prevList);
      showToast(err.message || "Failed to update feedback status", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const targetId = deletingId;
    const prevList = feedbackList;

    // Optimistic delete
    setFeedbackList((prev) => prev.filter((f) => f.id !== targetId));
    if (selectedItem?.id === targetId) {
      setSelectedItem(null);
    }
    setDeletingId(null);
    showToast("Feedback record deleted permanently.", "success");

    try {
      const res = await fetch(`/api/admin/feedback/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete feedback record.");
    } catch (err: any) {
      setFeedbackList(prevList);
      showToast(err.message || "Failed to delete feedback", "error");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs font-bold text-slate-700">{rating}.0</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search feedback or reviewer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved &amp; Live</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>

          <div className="w-36">
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Feedback Items Table / List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8FC] text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Feedback Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[#10243A] flex items-center justify-center font-bold text-xs uppercase">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-bold text-[#10243A]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderStars(item.rating)}</td>
                    <td className="px-6 py-4 max-w-xs md:max-w-md">
                      <p className="text-slate-700 line-clamp-2 text-xs leading-relaxed">
                        &quot;{item.message}&quot;
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status === "approved" && (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        {item.status === "rejected" && (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {item.status === "pending" && (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#64748B] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#155EEF] hover:bg-slate-100 transition-colors"
                          title="View Full Feedback"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {item.status !== "approved" && (
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, "approved")}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Approve &amp; Publish"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {item.status !== "rejected" && (
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, "rejected")}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {item.status !== "pending" && (
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, "pending")}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Revert to Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Permanently"
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
        ) : (
          <div className="p-12 text-center text-[#64748B]">
            <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No feedback submissions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Feedback submitted by students and customers will appear here for administrative moderation.
            </p>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Review Feedback Submission"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#155EEF]/10 text-[#155EEF] flex items-center justify-center font-bold text-sm">
                  {selectedItem.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#10243A] text-base">
                    {selectedItem.name}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Submitted {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>{renderStars(selectedItem.rating)}</div>
            </div>

            <div className="bg-[#F5F8FC] p-4 rounded-xl border border-[#E2E8F0]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                Feedback Message
              </label>
              <p className="text-sm text-[#172B4D] whitespace-pre-wrap leading-relaxed">
                {selectedItem.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] font-medium">Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedItem.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedItem.status === "rejected"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedItem.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedItem.status !== "approved" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedItem.id, "approved")}
                    isLoading={updatingId === selectedItem.id}
                  >
                    Approve &amp; Publish
                  </Button>
                )}
                {selectedItem.status !== "rejected" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedItem.id, "rejected")}
                    isLoading={updatingId === selectedItem.id}
                  >
                    Reject
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Feedback"
        message="Are you sure you want to permanently delete this feedback? This action cannot be undone."
        confirmLabel="Delete Permanently"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
