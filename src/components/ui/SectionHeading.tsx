import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-3xl mb-12 ${
        isCenter ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {badge && (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eff4ff] text-[#155EEF] border border-[#155EEF]/20 mb-3 ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] animate-pulse" />
          {badge}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10243A] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed ${
            isCenter ? "text-center !text-center mx-auto" : "text-left !text-left"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
