import React from "react";
import { requireAdminSession } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession("/admin/login");

  return (
    <AdminLayoutClient adminName={session.name} adminRole={session.role}>
      {children}
    </AdminLayoutClient>
  );
}
