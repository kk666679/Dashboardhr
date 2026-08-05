"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Building, Clock, Plus, Search, DollarSign, Calendar } from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import type { CapexProject } from "@/server/routers/capex";

const P = {
  blue: "#00d4ff", purple: "#7c5cfc", green: "#00d68f",
  amber: "#ffaa00", red: "#ff4d6d", muted: "#4d5468",
  text: "#f0f2f7", sub: "#8b92a9", bg: "#0f1117", card: "#161820",
  border: "rgba(255,255,255,0.06)",
};

const statusColors: Record<string, { color: string; bg: string }> = {
  "In Progress": { color: P.blue, bg: `${P.blue}15` },
  "Approved":    { color: P.green, bg: `${P.green}15` },
  "Pending":     { color: P.amber, bg: `${P.amber}15` },
  "Completed":   { color: P.muted, bg: `${P.muted}15` },
};

const riskColors: Record<string, { color: string; bg: string }> = {
  "Low":    { color: P.green, bg: `${P.green}12` },
  "Medium": { color: P.amber, bg: `${P.amber}12` },
  "High":   { color: P.red,   bg: `${P.red}12`   },
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: P.card, border: `1px solid ${P.border}`, color: P.text, fontFamily: "monospace" }}>
      {label && <div className="mb-1" style={{ color: P.sub }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? P.text }}>{p.name}: ${(p.value ?? 0).toFixed(2)}M</div>
      ))}
    </div>
  );
}

export default function CapexProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects = [], isLoading } = trpc.capex.listProjects.useQuery({ search: search || undefined });

  const filtered = statusFilter === "all" ? projects : projects.filter((p: CapexProject) => p.status === statusFilter);

  const totalBudget = projects.reduce((a: number, p: CapexProject) => a + p.budget, 0);
  const totalSpent  = projects.reduce((a: number, p: CapexProject) => a + p.spent, 0);
  const activeCount = projects.filter((p: CapexProject) => p.status === "In Progress").length;
  const avgRoi      = projects.length ? projects.reduce((a: number, p: CapexProject) => a + p.roi, 0) / projects.length : 0;

  // Budget burn chart uses project-level data as a proxy (requires real time-series later)
  const burnData = projects.slice(0, 6).map((p: CapexProject) => ({ month: p.start, budget: p.budget, actual: p.spent }));

  if (isLoading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <Skeleton className="h-64 rounded-xl" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Capital Projects"
        description="Project portfolio — budget, status, and ROI tracking"
        actions={<Button className="gap-2"><Plus size={14} /> New Project</Button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Total Portfolio" value={`$${totalBudget.toFixed(1)}M`} sub={`${projects.length} projects`} icon={<Building className="size-4" />} trend="neutral" />
        <StatCard title="Total Spent" value={`$${totalSpent.toFixed(1)}M`} sub={totalBudget ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% utilized` : "—"} icon={<TrendingUp className="size-4" />} trend="up" />
        <StatCard title="Active Projects" value={String(activeCount)} sub="In progress" icon={<Clock className="size-4" />} trend="neutral" />
        <StatCard title="Avg Portfolio ROI" value={`${avgRoi.toFixed(1)}%`} sub="Weighted average" icon={<TrendingUp className="size-4" />} trend="up" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <ChartCard title="Budget vs Actual" description="By project" aiInsight="Spend tracking">
            <ChartContainer aspectRatio={1.4}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                  <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} unit="$" />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="budget" name="Budget" stroke={P.blue} strokeWidth={2} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke={P.green} strokeWidth={2} dot={{ fill: P.green, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Project List</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-2.5" style={{ color: P.muted }} />
                    <Input placeholder="Search…" className="pl-8 h-8 text-xs w-40" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.length === 0 && (
                <p className="text-xs text-center py-8" style={{ color: P.sub }}>No projects match your filters</p>
              )}
              {filtered.map((project: CapexProject) => {
                const sc = statusColors[project.status] ?? { color: P.muted, bg: `${P.muted}15` };
                const rc = riskColors[project.risk] ?? { color: P.muted, bg: `${P.muted}12` };
                return (
                  <div key={project.id} className="rounded-xl p-4" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono" style={{ color: P.muted }}>{project.id}</span>
                          <span className="text-sm font-semibold" style={{ color: P.text }}>{project.title}</span>
                        </div>
                        {project.description && <p className="text-xs" style={{ color: P.sub }}>{project.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>{project.status}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: rc.bg, color: rc.color }}>{project.risk}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: P.sub }}>
                      <span className="flex items-center gap-1"><Building size={11} /> {project.dept}</span>
                      <span className="flex items-center gap-1"><DollarSign size={11} /> ${project.budget.toFixed(1)}M</span>
                      <span className="flex items-center gap-1"><TrendingUp size={11} style={{ color: P.green }} /> ROI: {project.roi}%</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {project.start} – {project.end}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> PM: {project.pm}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.progress === 100 ? P.green : project.risk === "High" ? P.red : P.blue }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: P.muted }}>{project.progress}%</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
