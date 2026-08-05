import * as React from "react";
import { cn } from "@/lib/utils";

/* ── PageShell ── full-width wrapper with consistent spacing ── */
export function PageShell({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-5", className)} {...props}>
      {children}
    </div>
  );
}

/* ── PageHeader ── consistent page title + actions ── */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, badge, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
}

/* ── StatCard ── single KPI tile ── */
interface StatCardProps {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, sub, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-[var(--radius-lg)]",
        "bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-xs)]",
        "transition-[box-shadow,border-color,transform] duration-200",
        "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">{title}</p>
        {icon && (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-muted)] text-[var(--brand)]">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold tracking-[-0.03em] leading-none tabular-nums text-[var(--foreground)]">
        {value}
      </div>
      {sub && (
        <div
          className={cn(
            "text-xs font-medium",
            trend === "up"      && "text-[var(--success-foreground)]",
            trend === "down"    && "text-[var(--destructive-foreground)]",
            trend === "neutral" && "text-[var(--foreground-muted)]",
            !trend              && "text-[var(--foreground-muted)]",
          )}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
