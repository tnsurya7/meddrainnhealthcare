"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminName: string;
  adminRole: string;
}

export function AdminLayoutClient({
  children,
  adminName,
  adminRole,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={adminName}
        adminRole={adminRole}
      />
      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          adminName={adminName}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
