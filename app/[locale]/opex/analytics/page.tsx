"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Target, TrendingUp, DollarSign, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

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
        <div key={i} style={{ color: p.color ?? P.text }}>{p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}{p.unit ?? ""}</div>
      ))}
    </div>
  );
}

export default function OpexAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m" | "1y">("6m");
  const { data, isLoading } = trpc.opex.analytics.useQuery({ timeRange });

  if (isLoading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <Skeleton className="h-64 rounded-xl" />
      </PageShell>
    );
  }

  const defectPareto   = data?.defectPareto ?? [];
  const cycleTimeTrend = data?.cycleTimeTrend ?? [];
  const costByCategory = data?.costByCategory ?? [];
  const sigmaLevelData = data?.sigmaLevelData ?? [];
  const leanMetrics    = data?.leanMetrics ?? [];
  const kpi            = data?.kpi ?? { processSigma: 0, flowEfficiency: 0, costPerUnit: 0, avgCycleTime: 0 };

  const emptyMsg = (label: string) => (
    <p className="text-xs text-center py-10" style={{ color: P.sub }}>No {label} data available</p>
  );

  return (
    <PageShell>
      <PageHeader
        title="Opex Analytics"
        description="Deep-dive operational excellence metrics and KPIs"
        actions={
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last month</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Process Sigma" value={kpi.processSigma ? `${kpi.processSigma}σ` : "—"} sub="Current baseline" icon={<Target className="size-4" />} trend="up" />
        <StatCard title="Flow Efficiency" value={kpi.flowEfficiency ? `${kpi.flowEfficiency}%` : "—"} sub="Target: 60%" icon={<TrendingUp className="size-4" />} trend="up" />
        <StatCard title="Cost per Unit" value={kpi.costPerUnit ? `$${kpi.costPerUnit.toFixed(2)}` : "—"} icon={<DollarSign className="size-4" />} trend="up" />
        <StatCard title="Avg Cycle Time" value={kpi.avgCycleTime ? `${kpi.avgCycleTime}s` : "—"} icon={<Clock className="size-4" />} trend="up" />
      </div>

      <Tabs defaultValue="defects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="defects">Defect Analysis</TabsTrigger>
          <TabsTrigger value="cycle">Cycle Time</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="sigma">Sigma Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="defects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Pareto Analysis — Root Causes" description="Defects by category" aiInsight={defectPareto.length ? "Top causes" : "No data"}>
              <ChartContainer aspectRatio={1.6}>
                {defectPareto.length === 0 ? emptyMsg("defect") : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={defectPareto}>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                      <XAxis dataKey="cause" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="defects" name="Defects" fill={P.purple} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </ChartCard>

            <Card>
              <CardHeader><CardTitle className="text-sm">Key Insights</CardTitle><CardDescription>From defect data</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: AlertTriangle, text: "Upload analytics data to see AI-generated defect insights", color: P.amber },
                  { icon: TrendingUp, text: "Pareto analysis will highlight top causes automatically", color: P.blue },
                  { icon: Target, text: "Sigma level targets will be tracked per process", color: P.green },
                  { icon: CheckCircle2, text: "Controllable causes are flagged for quick wins", color: P.purple },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: P.bg }}>
                    <item.icon size={14} style={{ color: item.color, marginTop: 2 }} />
                    <span className="text-xs" style={{ color: P.sub, lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycle" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Cycle Time vs Takt Time" description="Weekly tracking" aiInsight={cycleTimeTrend.length ? "Weekly trend" : "No data"}>
              <ChartContainer aspectRatio={1.6}>
                {cycleTimeTrend.length === 0 ? emptyMsg("cycle time") : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cycleTimeTrend}>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                      <XAxis dataKey="week" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="s" />
                      <Tooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey="cycleTime" name="Cycle Time" stroke={P.blue} strokeWidth={2} dot={{ fill: P.blue, r: 3 }} />
                      <Line type="monotone" dataKey="taktTime" name="Takt Time" stroke={P.red} strokeWidth={2} strokeDasharray="6 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </ChartCard>

            <ChartCard title="Lean Metrics vs Targets" description="Gap analysis">
              <ChartContainer aspectRatio={1.6}>
                {leanMetrics.length === 0 ? emptyMsg("lean metrics") : (
                  <div className="space-y-3 p-2">
                    {leanMetrics.map((m: any) => (
                      <div key={m.metric}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: P.sub }}>{m.metric}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ color: P.text, fontFamily: "monospace" }}>{m.value}</span>
                            <span className="text-[10px]" style={{ color: m.gap?.startsWith("+") ? P.amber : P.green }}>{m.gap}</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (parseFloat(m.value) / parseFloat(m.target)) * 100)}%`, background: (parseFloat(m.value) / parseFloat(m.target)) > 0.85 ? P.green : P.amber }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ChartContainer>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Cost by Category" description="Current vs prior period ($M)" aiInsight={costByCategory.length ? "Period comparison" : "No data"}>
              <ChartContainer aspectRatio={1.6}>
                {costByCategory.length === 0 ? emptyMsg("cost") : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costByCategory}>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                      <XAxis dataKey="category" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="$" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="prior" name="Prior Period" fill={P.red} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="current" name="Current" fill={P.green} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </ChartCard>

            <Card>
              <CardHeader><CardTitle className="text-sm">Variance Summary</CardTitle><CardDescription>Cost changes period-over-period</CardDescription></CardHeader>
              <CardContent>
                {costByCategory.length === 0 ? emptyMsg("variance") : (
                  <div className="space-y-2">
                    {costByCategory.map((cat: any) => (
                      <div key={cat.category} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: P.bg }}>
                        <span className="text-xs" style={{ color: P.sub }}>{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono" style={{ color: P.text }}>${cat.current.toFixed(1)}M</span>
                          <span className={`text-xs font-mono ${cat.variance < 0 ? "text-green-500" : "text-red-500"}`}>
                            {cat.variance > 0 ? "+" : ""}{cat.variance.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sigma" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Sigma Level by Process" description="Current vs target (5σ)" aiInsight={sigmaLevelData.length ? "Process comparison" : "No data"}>
              <ChartContainer aspectRatio={1.6}>
                {sigmaLevelData.length === 0 ? emptyMsg("sigma level") : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sigmaLevelData} layout="vertical">
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" horizontal={false} />
                      <XAxis type="number" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 6]} />
                      <YAxis type="category" dataKey="process" tick={{ fill: P.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="sigma" name="Current σ" fill={P.blue} radius={[0, 3, 3, 0]} />
                      <Bar dataKey="target" name="Target σ" fill={P.green} radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </ChartCard>

            <Card>
              <CardHeader><CardTitle className="text-sm">Sigma Performance Summary</CardTitle><CardDescription>DPMO equivalent and yield</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Weighted Avg Sigma", value: kpi.processSigma ? `${kpi.processSigma}σ` : "—", color: P.blue },
                  { label: "Flow Efficiency", value: kpi.flowEfficiency ? `${kpi.flowEfficiency}%` : "—", color: P.green },
                  { label: "Cost per Unit", value: kpi.costPerUnit ? `$${kpi.costPerUnit.toFixed(2)}` : "—", color: P.amber },
                  { label: "Avg Cycle Time", value: kpi.avgCycleTime ? `${kpi.avgCycleTime}s` : "—", color: P.purple },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: P.bg }}>
                    <span className="text-xs" style={{ color: P.sub }}>{m.label}</span>
                    <span className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
