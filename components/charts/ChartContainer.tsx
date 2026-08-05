import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: ReactNode;
  className?: string;
  aspectRatio?: number; // width / height, default 2
}

export function ChartContainer({ children, className, aspectRatio = 2 }: ChartContainerProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={{ aspectRatio: aspectRatio }}
    >
      {children}
    </div>
  );
}
