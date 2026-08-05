import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ─── Card (container) ───────────────────────────────────────────────────── */
const cardVariants = cva(
  "relative flex flex-col overflow-hidden text-[var(--card-foreground)]",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--surface-1)] border border-[var(--border)]",
          "rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]",
          "transition-[box-shadow,border-color] duration-200 ease-out",
        ].join(" "),
        elevated: [
          "bg-[var(--surface-2)] border border-[var(--border-strong)]",
          "rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]",
        ].join(" "),
        flat: [
          "bg-[var(--surface-0)] border border-[var(--border)]",
          "rounded-[var(--radius-lg)]",
        ].join(" "),
        ghost: [
          "bg-transparent border-0 shadow-none",
        ].join(" "),
        interactive: [
          "bg-[var(--surface-1)] border border-[var(--border)]",
          "rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]",
          "cursor-pointer select-none",
          "transition-[box-shadow,border-color,transform] duration-200 ease-out",
          "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-0.5",
          "active:scale-[0.99] active:shadow-[var(--shadow-xs)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1",
        ].join(" "),
        stat: [
          "bg-[var(--surface-1)] border border-[var(--border)]",
          "rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]",
          "transition-[box-shadow,border-color,transform] duration-200 ease-out",
          "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-0.5",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Card({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}
Card.displayName = "Card";

/* ─── Card Header ─────────────────────────────────────────────────────────── */
function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1 px-5 pt-5 pb-0",
        // support side-by-side icon + text layouts
        "[&:has([data-slot=card-icon])]:flex-row [&:has([data-slot=card-icon])]:items-start [&:has([data-slot=card-icon])]:gap-3",
        className
      )}
      {...props}
    />
  );
}
CardHeader.displayName = "CardHeader";

/* ─── Card Icon ────────────────────────────────────────────────────────────── */
function CardIcon({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-icon"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
        "bg-[var(--brand-muted)] text-[var(--brand)]",
        className
      )}
      {...props}
    />
  );
}
CardIcon.displayName = "CardIcon";

/* ─── Card Title ──────────────────────────────────────────────────────────── */
function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-sm font-semibold leading-tight tracking-[-0.01em] text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";

/* ─── Card Description ────────────────────────────────────────────────────── */
function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-xs leading-relaxed text-[var(--foreground-muted)]",
        className
      )}
      {...props}
    />
  );
}
CardDescription.displayName = "CardDescription";

/* ─── Card Content ────────────────────────────────────────────────────────── */
function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 py-4 flex-1", className)}
      {...props}
    />
  );
}
CardContent.displayName = "CardContent";

/* ─── Card Footer ─────────────────────────────────────────────────────────── */
function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-3 mt-auto",
        "border-t border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}
CardFooter.displayName = "CardFooter";

/* ─── Card Action (top-right corner) ─────────────────────────────────────── */
function CardAction({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-action"
      className={cn("absolute top-4 right-4 flex items-center gap-2", className)}
      {...props}
    />
  );
}
CardAction.displayName = "CardAction";

/* ─── Card Separator ─────────────────────────────────────────────────────── */
function CardSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      data-slot="card-separator"
      className={cn("border-0 border-t border-[var(--border)] mx-5", className)}
      {...props}
    />
  );
}
CardSeparator.displayName = "CardSeparator";

export {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  CardSeparator,
};
