"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const MAX_WIDTH_MAP: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function PageContainer({
  children,
  className,
  maxWidth = "full",
}: PageContainerProps) {
  return (
    <div className={cn("space-y-6 p-6", MAX_WIDTH_MAP[maxWidth], className)}>
      {children}
    </div>
  );
}
