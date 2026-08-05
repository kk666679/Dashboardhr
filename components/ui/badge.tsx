import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 font-medium leading-none whitespace-nowrap",
    "border transition-colors duration-150",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
  ].join(" "),
  {
    variants: {
      variant: {
        // Brand
        default: [
          "bg-[var(--brand-subtle)] text-[var(--brand)] border-[oklch(from_var(--brand)_l_c_h_/_0.25)]",
          "hover:bg-[var(--brand-muted)]",
        ].join(" "),

        // Neutral
        secondary: [
          "bg-[var(--surface-2)] text-[var(--foreground-muted)] border-[var(--border)]",
          "hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
        ].join(" "),

        // Outlined only
        outline: [
          "bg-transparent text-[var(--foreground-muted)] border-[var(--border-strong)]",
          "hover:bg-[var(--surface-1)]",
        ].join(" "),

        // Destructive / Error
        destructive: [
          "bg-[var(--destructive-subtle)] text-[var(--destructive-foreground)]",
          "border-[oklch(from_var(--destructive)_l_c_h_/_0.2)]",
        ].join(" "),

        // Success
        success: [
          "bg-[var(--success-subtle)] text-[var(--success-foreground)]",
          "border-[oklch(from_var(--success)_l_c_h_/_0.2)]",
        ].join(" "),

        // Warning
        warning: [
          "bg-[var(--warning-subtle)] text-[var(--warning-foreground)]",
          "border-[oklch(from_var(--warning)_l_c_h_/_0.2)]",
        ].join(" "),

        // Info
        info: [
          "bg-[var(--info-subtle)] text-[var(--info-foreground)]",
          "border-[oklch(from_var(--info)_l_c_h_/_0.2)]",
        ].join(" "),

        // Solid brand (e.g. notification count)
        solid: [
          "bg-[var(--brand)] text-[var(--brand-foreground)] border-transparent",
          "shadow-[var(--shadow-xs)]",
        ].join(" "),
      },
      size: {
        xs: "text-[0.625rem] px-1.5 py-0.5 rounded-[var(--radius-xs)] gap-0.5",
        sm: "text-xs px-2 py-0.5 rounded-[var(--radius-sm)]",
        default: "text-xs px-2.5 py-1 rounded-[var(--radius-sm)]",
        lg: "text-sm px-3 py-1 rounded-[var(--radius-md)]",
        dot: "text-xs px-2 py-0.5 rounded-[var(--radius-sm)] before:content-[''] before:size-1.5 before:rounded-full before:bg-current before:shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Render as a dot badge with a leading circle */
  dot?: boolean;
}

function Badge({ className, variant, size, dot, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant, size: dot ? "dot" : size }),
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
