import React from "react";
import { getAllServicesAdmin } from "@/lib/db/queries/services";
import { ServicesManagerTable } from "@/components/admin/ServicesManagerTable";

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
          Services & Training Management
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Add, organize, and publish biomedical training programs, workshops, and institutional services.
        </p>
      </div>

      <ServicesManagerTable initialServices={services} />
    </div>
  );
}
