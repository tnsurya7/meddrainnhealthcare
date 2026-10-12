import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  children,
  className = "",
  size = "default",
  ...props
}: ContainerProps) {
  const maxW =
    size === "narrow"
      ? "max-w-4xl"
      : size === "wide"
      ? "max-w-7xl"
      : "max-w-6xl";

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxW} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
