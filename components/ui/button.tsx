"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // base
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-[var(--radius-md)] border border-transparent font-medium whitespace-nowrap select-none",
    "text-sm leading-none",
    "transition-all duration-150 ease-out",
    "outline-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-invalid:ring-2 aria-invalid:ring-[var(--destructive)] aria-invalid:ring-offset-1",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-[0.875rem]",
    "active:scale-[0.97] active:brightness-95",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary – brand fill
        default: [
          "bg-[var(--brand)] text-[var(--brand-foreground)]",
          "border-[var(--brand)]",
          "shadow-[var(--shadow-xs)]",
          "hover:bg-[var(--brand-hover)] hover:shadow-[var(--shadow-sm)]",
          "active:bg-[var(--brand-active)]",
        ].join(" "),

        // Secondary – subtle surface
        secondary: [
          "bg-[var(--surface-2)] text-[var(--foreground)]",
          "border-[var(--border-strong)]",
          "hover:bg-[var(--surface-3)] hover:border-[oklch(1_0_0_/_0.2)] hover:shadow-[var(--shadow-sm)]",
        ].join(" "),

        // Outline – transparent with border
        outline: [
          "bg-transparent text-[var(--foreground)]",
          "border-[var(--border-strong)]",
          "hover:bg-[var(--surface-1)] hover:border-[var(--border-strong)]",
        ].join(" "),

        // Ghost – no border, no background
        ghost: [
          "bg-transparent text-[var(--foreground-muted)]",
          "hover:bg-[var(--surface-1)] hover:text-[var(--foreground)]",
        ].join(" "),

        // Destructive
        destructive: [
          "bg-[var(--destructive-subtle)] text-[var(--destructive-foreground)]",
          "border-[oklch(from_var(--destructive)_l_c_h_/_0.3)]",
          "hover:bg-[var(--destructive)] hover:text-white hover:border-[var(--destructive)]",
        ].join(" "),

        // Success
        success: [
          "bg-[var(--success-subtle)] text-[var(--success-foreground)]",
          "border-[oklch(from_var(--success)_l_c_h_/_0.3)]",
          "hover:bg-[var(--success)] hover:text-white hover:border-[var(--success)]",
        ].join(" "),

        // Warning
        warning: [
          "bg-[var(--warning-subtle)] text-[var(--warning-foreground)]",
          "border-[oklch(from_var(--warning)_l_c_h_/_0.3)]",
          "hover:bg-[var(--warning)] hover:text-black hover:border-[var(--warning)]",
        ].join(" "),

        // Link
        link: [
          "bg-transparent text-[var(--brand)] underline underline-offset-4 border-0",
          "hover:text-[var(--brand-hover)]",
          "active:scale-100",
        ].join(" "),
      },
      size: {
        xs:      "h-6 px-2 text-xs rounded-[var(--radius-sm)] gap-1 [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-7 px-2.5 text-xs rounded-[var(--radius-sm)]",
        default: "h-8 px-3",
        md:      "h-9 px-3.5 text-sm",
        lg:      "h-10 px-4 text-sm",
        xl:      "h-11 px-5 text-base",
        icon:    "size-8 rounded-[var(--radius-md)] p-0",
        "icon-xs":   "size-6 rounded-[var(--radius-sm)] p-0",
        "icon-sm":   "size-7 rounded-[var(--radius-sm)] p-0",
        "icon-md":   "size-9 rounded-[var(--radius-md)] p-0",
        "icon-lg":   "size-10 rounded-[var(--radius-lg)] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin size-[0.875rem] shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="sr-only">Loading…</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
