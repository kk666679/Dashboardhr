import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-[var(--radius-sm)] bg-[var(--surface-1)]",
        "animate-pulse",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
