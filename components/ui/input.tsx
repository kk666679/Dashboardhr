import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout
        "h-8 w-full min-w-0 px-3 py-1",
        // Typography
        "text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]",
        // Surface
        "bg-[var(--input)] border border-[var(--input-border)]",
        "rounded-[var(--radius-md)]",
        // Transition
        "transition-[border-color,box-shadow] duration-150 outline-none",
        // Focus
        "focus-visible:border-[var(--brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand-subtle)]",
        // Invalid
        "aria-invalid:border-[var(--destructive)] aria-invalid:ring-2 aria-invalid:ring-[var(--destructive-subtle)]",
        // File input
        "file:inline-flex file:h-5 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-[var(--foreground)]",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
