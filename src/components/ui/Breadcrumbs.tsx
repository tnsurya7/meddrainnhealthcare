import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  isLight?: boolean;
}

export function Breadcrumbs({ items, isLight = false }: BreadcrumbsProps) {
  const textColor = isLight ? "text-slate-300" : "text-[#64748B]";
  const activeColor = isLight ? "text-white font-semibold" : "text-[#10243A] font-semibold";
  const hoverColor = isLight ? "hover:text-[#38BDF8]" : "hover:text-[#155EEF]";
  const separatorColor = isLight ? "text-slate-400" : "text-[#CBD5E1]";

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link
            href="/"
            className={`inline-flex items-center gap-1 transition-colors ${textColor} ${hoverColor}`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              <ChevronRight className={`w-3.5 h-3.5 ${separatorColor}`} />
              {isLast || !item.href ? (
                <span className={activeColor} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors ${textColor} ${hoverColor}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
