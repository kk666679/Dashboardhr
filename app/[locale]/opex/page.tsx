"use client";

import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, Factory, Target, Zap, ArrowRight } from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import type { SixSigmaProject } from "@/server/routers/opex";

const P = {
  blue: "#00d4ff", purple: "#7c5cfc", green: "#00d68f",
  amber: "#ffaa00", red: "#ff4d6d", muted: "#4d5468",
  text: "#f0f2f7", sub: "#8b92a9", bg: "#0f1117",
  card: "#161820", border: "rgba(255,255,255,0.06)",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: P.card, border: `1px solid ${P.border}`, color: P.text, fontFamily: "monospace" }}>
      {label && <div className="mb-1" style={{ color: P.sub }}>{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? P.text }}>
          {p.name}: {typeof p.value === "number" ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
        </div>
      ))}
    </div>
  );
}

export default function OpexOverviewPage() {
  const { data, isLoading } = trpc.opex.overview.useQuery();

  if (isLoading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-56 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div>
      </PageShell>
    );
  }

  const totalSavings     = data?.totalSavings ?? 0;
  const oee              = data?.oee ?? 0;
  const kaizenIdeas      = data?.kaizenIdeas ?? 0;
  const savingsBreakdown = data?.savingsBreakdown ?? [];
  const oeeTrend         = data?.oeeTrend ?? [];
  const wasteReduction   = data?.wasteReduction ?? [];
  const costSavingsData  = data?.costSavingsData ?? [];
  const sixSigmaProjects = data?.sixSigmaProjects ?? [];

  return (
    <PageShell>
      <PageHeader
        title="Operational Excellence"
        description="Monitor Lean, Six Sigma, Kaizen, and continuous improvement initiatives"
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Total Cost Savings" value={`$${(totalSavings / 1e6).toFixed(1)}M`} sub="Year to date" icon={<DollarSign className="size-4" />} trend="up" />
        <StatCard title="OEE (Overall)" value={`${oee}%`} sub="Overall equipment effectiveness" icon={<Factory className="size-4" />} trend="up" />
        <StatCard title="Active Projects" value={String(sixSigmaProjects.length)} icon={<Target className="size-4" />} trend="neutral" />
        <StatCard title="Kaizen Ideas" value={String(kaizenIdeas)} sub="Submitted" icon={<Zap className="size-4" />} trend="up" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Cost Savings Trend" description="Monthly savings from Lean, Six Sigma, and waste reduction" aiInsight={costSavingsData.length ? "Monthly breakdown" : "No data yet"}>
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costSavingsData}>
                <defs>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.red} stopOpacity={0.3} /><stop offset="95%" stopColor={P.red} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="leanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.blue} stopOpacity={0.3} /><stop offset="95%" stopColor={P.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="waste" name="Waste Reduction" stroke={P.red} fill="url(#wasteGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="lean" name="Lean" stroke={P.blue} fill="url(#leanGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="sixSigma" name="Six Sigma" stroke={P.purple} fill="none" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Savings Breakdown" description={`Total: $${(totalSavings / 1e6).toFixed(1)}M`} aiInsight={savingsBreakdown.length ? "By program" : "No data yet"}>
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={savingsBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" nameKey="name"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {savingsBreakdown.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="OEE Trend" description="Overall Equipment Effectiveness — trajectory" aiInsight={oeeTrend.length ? "Target 80% by Q4" : "No data yet"}>
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oeeTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[55, 85]} unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="oee" name="OEE %" stroke={P.green} strokeWidth={3} dot={{ fill: P.green, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Waste Reduction (8 Wastes)" description="Before vs after — instances per month" aiInsight={wasteReduction.length ? "Avg reduction" : "No data yet"}>
          <ChartContainer aspectRatio={1.8}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteReduction}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="before" name="Before" fill={P.red} radius={[3, 3, 0, 0]} />
                <Bar dataKey="after" name="After" fill={P.green} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Active Six Sigma Projects</span>
            <Link href="/opex/six-sigma" className="text-xs flex items-center gap-1" style={{ color: P.blue }}>
              View All <ArrowRight size={12} />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sixSigmaProjects.length === 0 && (
            <p className="text-xs text-center py-6" style={{ color: P.sub }}>No active projects. <Link href="/opex/six-sigma" style={{ color: P.blue }}>Create one →</Link></p>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {sixSigmaProjects.map((project: SixSigmaProject) => {
              const phaseColors: Record<string, string> = { Define: P.blue, Measure: P.purple, Analyze: P.amber, Improve: P.green, Control: P.red };
              return (
                <div key={project.id} className="rounded-xl p-4" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono" style={{ color: P.muted }}>{project.id}</span>
                    <Badge variant="outline" className="text-[10px]" style={{
                      background: project.status === "at-risk" ? `${P.red}15` : `${P.green}15`,
                      color: project.status === "at-risk" ? P.red : P.green,
                      border: `1px solid ${project.status === "at-risk" ? `${P.red}30` : `${P.green}30`}`,
                    }}>
                      {project.status === "at-risk" ? "⚠ At Risk" : "✓ On Track"}
                    </Badge>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: P.text }}>{project.title}</div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: phaseColors[project.phase] }}>Phase: {project.phase}</span>
                    <span style={{ color: P.sub, fontFamily: "monospace" }}>{project.sigma}σ</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: phaseColors[project.phase] }} />
                  </div>
                  <div className="text-xs mt-1 font-mono" style={{ color: P.muted }}>{project.progress}% complete</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { title: "Lean Management",  href: "/opex/lean",       desc: "8 Wastes, VSM, Takt, OEE", color: P.blue   },
          { title: "Six Sigma DMAIC",  href: "/opex/six-sigma",  desc: "Define → Control",          color: P.purple },
          { title: "Kaizen",           href: "/opex/kaizen",     desc: "Continuous improvement",    color: P.amber  },
          { title: "Kanban Board",     href: "/opex/kanban",     desc: "Sprint management",         color: P.green  },
          { title: "Opex Analytics",   href: "/opex/analytics",  desc: "Deep dive metrics",         color: P.red    },
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
