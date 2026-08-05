"use client";

import { useMemo, useState } from "react";
import { trpc } from "@/hooks/client/trpc";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { BarChart3, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const TIME_RANGE_MONTHS: Record<string, number> = { "7d": 1, "30d": 3, "90d": 6 };

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const months = TIME_RANGE_MONTHS[timeRange] ?? 3;

  const headcountQ       = trpc.analytics.getHeadcountSummary.useQuery();
  const turnoverQ        = trpc.analytics.getTurnoverRate.useQuery({ months }, { enabled: !!months });
  const departmentQ      = trpc.analytics.getDepartmentBreakdown.useQuery();

  const maxDeptTotal = useMemo(() => {
    const list = departmentQ.data ?? [];
    return Math.max(1, ...list.map((d) => d.total));
  }, [departmentQ.data]);

  const foreignPct = useMemo(() => {
    const total = headcountQ.data?.total ?? 0;
    if (!total) return 0;
    const foreign = departmentQ.data?.reduce((acc, d) => acc + d.foreign, 0) ?? 0;
    return Math.round((foreign / total) * 100);
  }, [headcountQ.data, departmentQ.data]);

  return (
    <PageShell>
      <PageHeader
        title="Analytics Dashboard"
        description="Operational analytics derived from your tenant data"
        actions={
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {headcountQ.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[var(--radius-lg)]" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Employees"
              value={(headcountQ.data?.total ?? 0).toLocaleString()}
              sub={`${headcountQ.data?.active ?? 0} active`}
              icon={<Users className="size-4" />}
              trend="up"
            />
            <StatCard
              title="Turnover Rate"
              value={`${turnoverQ.data?.turnoverRatePct ?? 0}%`}
              sub={`${turnoverQ.data?.separations ?? 0} separations`}
              icon={<TrendingUp className="size-4" />}
              trend={
                (turnoverQ.data?.turnoverRatePct ?? 0) > 10 ? "down" : "up"
              }
            />
            <StatCard
              title="Analysis Period"
              value={`${months} mo`}
              sub="selected time range"
              icon={<Clock className="size-4" />}
              trend="neutral"
            />
            <StatCard
              title="Foreign Workers %"
              value={`${foreignPct}%`}
              sub="of total headcount"
              icon={<CheckCircle className="size-4" />}
              trend="neutral"
            />
          </>
        )}
      </div>

      {/* Department breakdown + Turnover notes */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Department breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="size-4 text-[var(--brand)]" aria-hidden="true" />
              Department Breakdown
            </CardTitle>
            <CardDescription>Total employees and foreign allocation by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {departmentQ.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))
            ) : (departmentQ.data ?? []).length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--foreground-muted)]">No data</p>
            ) : (
              (departmentQ.data ?? []).map((row, i) => (
                <motion.div
                  key={row.department}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--foreground)]">{row.department}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" size="xs">
                        Foreign: {row.foreign}
                      </Badge>
                      <span className="font-mono font-semibold tabular-nums text-[var(--foreground)]">
                        {row.total}
                      </span>
                    </div>
                  </div>
                  <Progress value={(row.total / maxDeptTotal) * 100} className="h-1.5" />
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Turnover summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Turnover Summary</CardTitle>
            <CardDescription>Calculated from tenant headcount model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Months selected",  value: months,                                                               mono: false },
              { label: "Turnover rate",    value: `${turnoverQ.data?.turnoverRatePct ?? 0}%`,                           mono: true  },
              { label: "Separations",      value: (turnoverQ.data?.separations ?? 0).toString(),                       mono: true  },
              { label: "Total headcount",  value: (headcountQ.data?.total ?? 0).toLocaleString(),                      mono: true  },
              { label: "Active employees", value: (headcountQ.data?.active ?? 0).toLocaleString(),                     mono: true  },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-0)] px-3 py-2"
              >
                <span className="text-xs text-[var(--foreground-muted)]">{label}</span>
                <span className={[
                  "text-sm font-semibold",
                  mono && "font-mono tabular-nums",
                ].filter(Boolean).join(" ")}>
                  {turnoverQ.isLoading || headcountQ.isLoading ? "…" : value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
