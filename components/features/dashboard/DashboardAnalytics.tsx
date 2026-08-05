"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart, LineChart } from "@/components/charts";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const revenueData = [
  { month: "Jan", revenue: 12000, expenses: 8000 },
  { month: "Feb", revenue: 15000, expenses: 9000 },
  { month: "Mar", revenue: 18000, expenses: 10000 },
  { month: "Apr", revenue: 17000, expenses: 9500 },
  { month: "May", revenue: 20000, expenses: 11000 },
  { month: "Jun", revenue: 22000, expenses: 12000 },
];

const userGrowthData = [
  { month: "Jan", users: 120, active: 80 },
  { month: "Feb", users: 135, active: 90 },
  { month: "Mar", users: 150, active: 100 },
  { month: "Apr", users: 165, active: 110 },
  { month: "May", users: 180, active: 120 },
  { month: "Jun", users: 200, active: 135 },
];

/* ─── Period tabs ──────────────────────────────────────────────────────────── */
const periods = ["1W", "1M", "3M", "6M", "YTD"] as const;
type Period = (typeof periods)[number];

/* ─── Chart card ───────────────────────────────────────────────────────────── */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: { label: string; positive: boolean };
  children: React.ReactNode;
  delay?: number;
  reduced: boolean;
  showPeriods?: boolean;
}

function ChartPanel({
  title,
  subtitle,
  badge,
  children,
  delay = 0,
  reduced,
  showPeriods = false,
}: ChartCardProps) {
  const [period, setPeriod] = useState<Period>("6M");

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={
        reduced
          ? undefined
          : { duration: 0.4, delay, type: "spring", stiffness: 300, damping: 28 }
      }
      className={cn(
        "flex flex-col",
        "bg-[var(--surface-1)] border border-[var(--border)]",
        "rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]",
        "overflow-hidden",
        "transition-[box-shadow,border-color] duration-200 ease-out",
        "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]",
      )}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-[var(--border)]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[var(--foreground)] leading-tight">
              {title}
            </h3>
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-[var(--radius-sm)]",
                  badge.positive
                    ? "bg-[var(--success-subtle)] text-[var(--success-foreground)]"
                    : "bg-[var(--destructive-subtle)] text-[var(--destructive-foreground)]",
                )}
              >
                {badge.positive ? (
                  <TrendingUp className="size-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-3" aria-hidden="true" />
                )}
                {badge.label}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showPeriods && (
            <div
              className="flex items-center gap-0.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] p-0.5"
              role="tablist"
              aria-label="Select time period"
            >
              {periods.map((p) => (
                <button
                  key={p}
                  role="tab"
                  aria-selected={period === p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "h-6 min-w-[2rem] px-2 rounded-[calc(var(--radius-md)-2px)] text-[11px] font-medium",
                    "transition-all duration-150",
                    period === p
                      ? "bg-[var(--surface-0)] text-[var(--foreground)] shadow-[var(--shadow-xs)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
            aria-label="More options"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      {/* Chart body */}
      <div className="flex-1 px-5 py-4">{children}</div>
    </motion.div>
  );
}

/* ─── Legend dot ───────────────────────────────────────────────────────────── */
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
      <span
        className="size-2 rounded-full shrink-0"
        style={{ background: color }}
        aria-hidden="true"
      />
      {label}
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export function DashboardAnalytics() {
  const { t } = useTranslation();
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="space-y-4">
      {/* Revenue vs Expenses */}
      <ChartPanel
        title={(t("dashboard.revenue") as string) || "Revenue vs Expenses"}
        subtitle="Figures in MYR · Monthly comparison"
        badge={{ label: "+22% MoM", positive: true }}
        delay={0}
        reduced={reduced}
        showPeriods
      >
        <div className="flex items-center gap-4 mb-3">
          <LegendDot color="var(--brand)" label="Revenue" />
          <LegendDot color="var(--destructive)" label="Expenses" />
        </div>
        <BarChart data={revenueData} xKey="month" yKey={["revenue", "expenses"]} />
      </ChartPanel>

      {/* Employee growth */}
      <ChartPanel
        title={(t("dashboard.userGrowth") as string) || "Workforce Growth"}
        subtitle="Total vs active headcount trend"
        badge={{ label: "+67% 6M", positive: true }}
        delay={0.06}
        reduced={reduced}
        showPeriods
      >
        <div className="flex items-center gap-4 mb-3">
          <LegendDot color="var(--brand)" label="Total" />
          <LegendDot color="#22c55e" label="Active" />
        </div>
        <LineChart data={userGrowthData} xKey="month" yKey={["users", "active"]} />
      </ChartPanel>
    </div>
  );
}
