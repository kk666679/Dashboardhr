"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Target, AlertTriangle, Plus, Download, ArrowRight } from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

const P = {
  blue: "#00d4ff", green: "#00d68f", amber: "#ffaa00", red: "#ff4d6d",
  muted: "#4d5468", text: "#f0f2f7", sub: "#8b92a9", bg: "#0f1117",
  card: "#161820", border: "rgba(255,255,255,0.06)",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: P.card, border: `1px solid ${P.border}`, color: P.text, fontFamily: "monospace" }}>
      {label && <div className="mb-1" style={{ color: P.sub }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? P.text }}>{p.name}: ${typeof p.value === "number" ? p.value.toFixed(1) : p.value}M</div>
      ))}
    </div>
  );
}

export default function CapexBudgetPage() {
  const { data, isLoading } = trpc.capex.budget.useQuery();

  const deptBudget     = data?.deptBudget ?? [];
  const quarterlyBudget = data?.quarterlyBudget ?? [];
  const approvalQueue  = data?.approvalQueue ?? [];

  const totalAnnual    = deptBudget.reduce((a: number, d: any) => a + d.annual, 0);
  const totalYtd       = deptBudget.reduce((a: number, d: any) => a + d.ytd, 0);
  const totalRemaining = deptBudget.reduce((a: number, d: any) => a + d.remaining, 0);
  const atRisk         = deptBudget.filter((d: any) => d.status === "at-risk").length;

  if (isLoading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-56 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Budget Planning"
        description="Capex budget allocation, variance tracking, and approval workflow"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2"><Download size={14} /> Export</Button>
            <Button className="gap-2"><Plus size={14} /> New Request</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Annual Budget" value={`$${totalAnnual.toFixed(1)}M`} sub="FY 2026" icon={<DollarSign className="size-4" />} trend="neutral" />
        <StatCard title="YTD Spend" value={`$${totalYtd.toFixed(1)}M`} sub={totalAnnual ? `${((totalYtd / totalAnnual) * 100).toFixed(0)}% utilized` : "—"} icon={<TrendingUp className="size-4" />} trend="up" />
        <StatCard title="Remaining" value={`$${totalRemaining.toFixed(1)}M`} sub={`Across ${deptBudget.length} departments`} icon={<Target className="size-4" />} trend="neutral" />
        <StatCard title="At Risk" value={String(atRisk)} sub="Departments over budget" icon={<AlertTriangle className="size-4" />} trend="down" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Quarterly Budget vs Spend" description="Variance tracking" aiInsight="Period overview">
          <ChartContainer aspectRatio={1.6}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyBudget}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="quarter" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="$" />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="allocated" name="Allocated" fill={P.blue} radius={[3, 3, 0, 0]} />
                <Bar dataKey="spent" name="Spent" fill={P.green} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approval Queue</CardTitle>
            <CardDescription>Pending budget requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvalQueue.length === 0 && <p className="text-xs text-center py-4" style={{ color: P.sub }}>No pending requests</p>}
            {approvalQueue.map((req: any) => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: req.status === "approved" ? `${P.green}08` : P.bg, border: `1px solid ${req.status === "approved" ? `${P.green}20` : P.border}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: P.muted }}>{req.id}</span>
                    <span className="text-xs font-medium" style={{ color: P.text }}>{req.title}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: P.sub }}>
                    <span>{req.dept}</span><span>{req.submitted}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono" style={{ color: P.blue }}>${req.amount.toFixed(2)}M</div>
                  <Badge variant="outline" className="text-[10px]" style={{ background: req.status === "approved" ? `${P.green}15` : `${P.amber}15`, color: req.status === "approved" ? P.green : P.amber, border: `1px solid ${req.status === "approved" ? `${P.green}30` : `${P.amber}30`}` }}>
                    {req.status === "approved" ? "✓ Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs gap-1" style={{ color: P.blue }}>
              View All Requests <ArrowRight size={12} />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Department Budget Allocation</CardTitle>
          <CardDescription>Annual budget, YTD spend, and remaining by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {deptBudget.length === 0 && <p className="text-xs text-center py-4" style={{ color: P.sub }}>No budget data yet</p>}
            {deptBudget.map((dept: any) => {
              const pctUsed = dept.annual > 0 ? (dept.ytd / dept.annual) * 100 : 0;
              return (
                <div key={dept.dept} className="p-3 rounded-lg" style={{ background: P.bg }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: P.text }}>{dept.dept}</span>
                      {dept.status === "at-risk" && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${P.red}15`, color: P.red }}>At Risk</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span style={{ color: P.sub }}>Annual: ${dept.annual.toFixed(1)}M</span>
                      <span style={{ color: P.blue }}>YTD: ${dept.ytd.toFixed(1)}M</span>
                      <span style={{ color: dept.remaining < 0.5 ? P.red : P.green }}>Remaining: ${dept.remaining.toFixed(2)}M</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pctUsed}%`, background: pctUsed > 80 ? P.red : pctUsed > 60 ? P.amber : P.green }} />
                  </div>
                  <div className="flex justify-end text-[10px] mt-0.5" style={{ color: P.muted, fontFamily: "monospace" }}>{pctUsed.toFixed(0)}% used</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
