"use client";

import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, DollarSign, Target, Plus, ArrowRight,
} from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

const P = {
  blue: "#00d4ff", purple: "#7c5cfc", green: "#00d68f",
  amber: "#ffaa00", red: "#ff4d6d", muted: "#4d5468",
  text: "#f0f2f7", sub: "#8b92a9", bg: "#0f1117", card: "#161820",
  border: "rgba(255,255,255,0.06)",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: P.card, border: `1px solid ${P.border}`, color: P.text, fontFamily: "monospace" }}>
      {label && <div className="mb-1" style={{ color: P.sub }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? P.text }}>
          {p.name}: ${typeof p.value === "number" ? p.value.toFixed(1) : p.value}M
        </div>
      ))}
    </div>
  );
}

export default function CapexOverviewPage() {
  const { data, isLoading } = trpc.capex.overview.useQuery();

  const totalAllocated = data?.totalAllocated ?? 0;
  const totalSpent = data?.totalSpent ?? 0;
  const totalRemaining = data?.totalRemaining ?? 0;
  const avgRoi = data?.avgRoi ?? 0;
  const topProjects = data?.topProjects ?? [];
  const budgetData = data?.budgetData ?? [];
  const budgetAllocation = data?.budgetAllocation ?? [];
  const spendTrend = data?.spendTrend ?? [];

  if (isLoading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </PageShell>
    );
  }

  const statusColors: Record<string, string> = {
    "In Progress": P.blue, "Approved": P.green, "Pending": P.amber, "Completed": P.muted,
  };

  return (
    <PageShell>
      <PageHeader
        title="Capital Expenditure"
        description="Monitor capex budgets, project portfolios, ROI, and asset investments"
        actions={
          <Button variant="default" className="gap-2" asChild>
            <Link href="/capex/projects"><Plus size={14} /> New Project</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Total Budget" value={`$${totalAllocated.toFixed(1)}M`} sub="FY 2026" icon={<DollarSign className="size-4" />} trend="neutral" />
        <StatCard title="Total Spent" value={`$${totalSpent.toFixed(1)}M`} sub={totalAllocated ? `${((totalSpent / totalAllocated) * 100).toFixed(0)}% utilization` : "—"} icon={<TrendingUp className="size-4" />} trend="up" />
        <StatCard title="Remaining" value={`$${totalRemaining.toFixed(1)}M`} sub="Across all departments" icon={<Target className="size-4" />} trend="neutral" />
        <StatCard title="Avg Projected ROI" value={`${avgRoi.toFixed(0)}%`} sub="Portfolio average" icon={<TrendingUp className="size-4" />} trend="up" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Budget by Department" description="Allocated vs spent ($M)" aiInsight={totalAllocated ? `${((totalSpent / totalAllocated) * 100).toFixed(0)}% utilized` : "No data"}>
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="dept" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="$" />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="allocated" name="Allocated" fill={P.blue} radius={[3, 3, 0, 0]} />
                <Bar dataKey="spent" name="Spent" fill={P.green} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Capex Allocation" description={`Total: $${totalAllocated.toFixed(1)}M`} aiInsight="By category">
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetAllocation} cx="50%" cy="50%" innerRadius={45} outerRadius={80}
                  dataKey="value" nameKey="name"
                  label={({ name, value }: any) => `${name} $${(value as number).toFixed(1)}M`} labelLine={false}>
                  {budgetAllocation.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Capex Spend Trend" description="Planned vs actual monthly spend" aiInsight="Monthly tracking">
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendTrend}>
                <defs>
                  <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.blue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={P.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="$" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="planned" name="Planned" stroke={P.blue} fill="url(#plannedGrad)" strokeWidth={2} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="actual" name="Actual" stroke={P.green} fill="none" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Top Capital Projects</span>
              <Link href="/capex/projects" className="text-xs flex items-center gap-1" style={{ color: P.blue }}>
                View All <ArrowRight size={12} />
              </Link>
            </CardTitle>
            <CardDescription>By budget size</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProjects.length === 0 && (
              <p className="text-xs text-center py-6" style={{ color: P.sub }}>No projects yet</p>
            )}
            {topProjects.map((project: any) => (
              <div key={project.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: P.bg }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: P.muted }}>{project.id}</span>
                    <span className="text-xs font-medium truncate" style={{ color: P.text }}>{project.title}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: P.sub }}>${project.budget.toFixed(1)}M</span>
                    <Badge variant="outline" className="text-[10px]" style={{ background: `${statusColors[project.status] ?? P.muted}15`, color: statusColors[project.status] ?? P.muted, border: `1px solid ${statusColors[project.status] ?? P.muted}30` }}>
                      {project.status}
                    </Badge>
                    <span className="text-xs font-mono" style={{ color: P.green }}>ROI: {project.roi}%</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${P.green}12`, color: P.green, fontFamily: "monospace" }}>
                  {project.budget > 0 ? ((project.spent / project.budget) * 100).toFixed(0) : "0"}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { title: "Capital Projects", href: "/capex/projects", desc: "Portfolio & status", color: P.blue },
          { title: "Budget Planning", href: "/capex/budget", desc: "Allocation & variance", color: P.purple },
          { title: "ROI Analysis", href: "/capex/roi", desc: "Returns & payback", color: P.green },
          { title: "Asset Management", href: "/capex/assets", desc: "Register & depreciation", color: P.amber },
          { title: "ISO Management", href: "/capex/iso", desc: "Compliance, audits & CAPA", color: P.red },
          { title: "OPEX", href: "/capex/opex", desc: "Lean, Six Sigma & Kaizen", color: P.amber },
        ].map((link) => (
          <Link key={link.title} href={link.href}>
            <div className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]" style={{ background: `${link.color}08`, border: `1px solid ${link.color}20` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: link.color }}>{link.title}</div>
              <div className="text-xs" style={{ color: P.sub }}>{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
