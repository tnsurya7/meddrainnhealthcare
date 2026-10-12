"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Service } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/Toast";
import { Edit, Trash2, Plus, ArrowUpDown } from "lucide-react";

interface ServicesManagerTableProps {
  initialServices: Service[];
}

export function ServicesManagerTable({
  initialServices,
}: ServicesManagerTableProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!deletingId) return;
    const targetId = deletingId;
    const previousServices = services;

    // Optimistic removal for instant UI response
    setServices((prev) => prev.filter((s) => s.id !== targetId));
    setDeletingId(null);
    showToast("Service deleted successfully.", "success");

    try {
      const res = await fetch(`/api/admin/services/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setServices(previousServices);
        throw new Error("Failed to delete service.");
      }
    } catch (err: any) {
      setServices(previousServices);
      showToast(err.message || "Failed to delete service", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          {services.length} total services configured
        </p>
        <Link href="/admin/services/new">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Service
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F8FC] text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Title & Details</th>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#10243A]">{service.title}</p>
                    <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5 max-w-md">
                      {service.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-[#155EEF]">
                    {service.icon}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        service.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {service.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#64748B]">
                    #{service.displayOrder}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="p-2 text-slate-500 hover:text-[#155EEF] hover:bg-slate-100 rounded-lg"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingId(service.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Service"
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

      <ConfirmationDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? It will no longer appear on the website."
        confirmLabel="Delete Service"
        isLoading={isDeleting}
      />
    </div>
  );
}
