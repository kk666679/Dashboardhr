"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Plus, Download, Upload, RefreshCw, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Page Header ─────────────────────────────────────────────────────────────

export interface PageAction {
  label:    string;
  icon?:    React.ComponentType<{ className?: string }>;
  onClick:  () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  badge?:   string;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title:       string;
  description?: string;
  badge?:      string;
  actions?:    PageAction[];
  className?:  string;
}

export function PageHeader({ title, description, badge, actions = [], className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl truncate">
            {title}
          </h1>
          {badge && (
            <Badge variant="secondary" className="text-xs">{badge}</Badge>
          )}
        </div>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--foreground-muted)] truncate">{description}</p>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Button
                key={i}
                variant={action.variant ?? "outline"}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className="gap-1.5 text-xs"
              >
                {Icon && <Icon className="size-3.5" />}
                {action.label}
                {action.badge && (
                  <Badge variant="secondary" className="ml-1 text-[10px]">{action.badge}</Badge>
                )}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

export interface StatCard {
  label:   string;
  value:   string | number;
  change?: string;
  trend?:  "up" | "down" | "neutral";
  icon?:   React.ComponentType<{ className?: string }>;
  href?:   string;
  onClick?: () => void;
}

export function StatsGrid({ stats }: { stats: StatCard[] }) {
  const router = useRouter();
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        const clickable = s.href || s.onClick;
        return (
          <div
            key={i}
            onClick={() => { if (s.href) router.push(s.href); s.onClick?.(); }}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={(e) => { if (clickable && (e.key === "Enter" || e.key === " ")) { if (s.href) router.push(s.href); s.onClick?.(); } }}
            className={cn(
              "rounded-xl border bg-[var(--surface-1)] p-4",
              "flex flex-col gap-2",
              clickable && "cursor-pointer hover:border-[var(--brand)] hover:shadow-sm transition-all",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--foreground-muted)] font-medium">{s.label}</span>
              {Icon && <Icon className="size-4 text-[var(--foreground-subtle)]" />}
            </div>
            <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{s.value}</p>
            {s.change && (
              <p className={cn(
                "text-xs font-medium",
                s.trend === "up"   && "text-[var(--success)]",
                s.trend === "down" && "text-[var(--destructive)]",
                s.trend === "neutral" && "text-[var(--foreground-muted)]",
              )}>
                {s.change}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title:       string;
  description?: string;
  action?:     { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-1)] py-16 text-center">
      {Icon && <Icon className="mb-3 size-10 text-[var(--foreground-subtle)]" />}
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-[var(--foreground-muted)] max-w-xs">{description}</p>
      )}
      {action && (
        <Button size="sm" className="mt-4 gap-1.5" onClick={action.onClick}>
          <Plus className="size-3.5" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─── Table Toolbar ─────────────────────────────────────────────────────────────

export function TableToolbar({
  searchPlaceholder = "Search…",
  onSearch,
  onFilter,
  onExport,
  onImport,
  onRefresh,
  extraActions,
}: {
  searchPlaceholder?: string;
  onSearch?:  (q: string) => void;
  onFilter?:  () => void;
  onExport?:  () => void;
  onImport?:  () => void;
  onRefresh?: () => void;
  extraActions?: PageAction[];
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--foreground-subtle)]" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-8 h-8 text-sm"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {onFilter  && <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onFilter}><Filter className="size-3.5" />Filter</Button>}
        {onRefresh && <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRefresh}><RefreshCw className="size-3.5" />Refresh</Button>}
        {onImport  && <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onImport}><Upload className="size-3.5" />Import</Button>}
        {onExport  && <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onExport}><Download className="size-3.5" />Export</Button>}
        {extraActions?.map((a, i) => {
          const Icon = a.icon;
          return (
            <Button key={i} variant={a.variant ?? "outline"} size="sm" className="gap-1.5 text-xs" onClick={a.onClick} disabled={a.disabled}>
              {Icon && <Icon className="size-3.5" />}{a.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /></div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
      </div>
    </div>
  );
}
