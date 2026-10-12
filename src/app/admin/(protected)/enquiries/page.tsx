import React from "react";
import { getAllEnquiriesAdmin } from "@/lib/db/queries/enquiries";
import { EnquiriesManager } from "@/components/admin/EnquiriesManager";

export default async function AdminEnquiriesPage() {
  const result = await getAllEnquiriesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
          Admission Enquiries Management
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Review, manage follow-ups, update admission status, and record private administrative notes.
        </p>
      </div>

      <EnquiriesManager
        initialEnquiries={result.enquiries}
        totalCount={result.total}
      />
    </div>
  );
}
