import React from "react";
import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/db/queries/services";
import { ServiceForm } from "@/components/admin/ServiceForm";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return <ServiceForm initialData={service} isEditing={true} />;
}
