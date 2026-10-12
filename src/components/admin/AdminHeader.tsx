"use client";

import React from "react";
import { Menu, Bell, User } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  adminName?: string;
}

export function AdminHeader({
  onToggleSidebar,
  adminName = "Administrator",
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#64748B] hover:text-[#10243A] hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs sm:text-sm font-semibold text-[#64748B] hidden sm:inline">
          Biomed Institute Management System
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#155EEF] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#10243A] hidden sm:inline">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
}
