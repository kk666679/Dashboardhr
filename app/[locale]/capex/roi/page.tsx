"use client";

import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Building, TrendingDown, AlertTriangle, Search, Plus, Filter, Calendar, Wrench } from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import type { CapexAsset } from "@/server/routers/capex";

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
        <div key={i} style={{ color: p.color ?? P.text }}>{p.name}: ${typeof p.value === "number" ? p.value.toFixed(1) : p.value}M</div>
      ))}
    </div>
  );
}

export default function CapexAssetsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = trpc.capex.assets.useQuery({ search: search || undefined });

  if (isLoading) {
    return (
      <PageShell>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <Skeleton className="h-64 rounded-xl" />
      </PageShell>
    );
  }

  const assets              = data?.assets ?? [];
  const categories          = data?.categories ?? [];
  const depreciationSchedule = data?.depreciationSchedule ?? [];
  const maintenanceAlerts   = data?.maintenanceAlerts ?? [];
  const kpi                 = data?.kpi ?? { totalValue: 0, totalCount: 0, currentNet: 0, overdueCount: 0 };

  return (
    <PageShell>
      <PageHeader
        title="Asset Management"
        description="Capital asset register, depreciation tracking, and maintenance scheduling"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2"><Filter size={14} /> Filter</Button>
            <Button className="gap-2"><Plus size={14} /> Add Asset</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Total Asset Value" value={`$${kpi.totalValue.toFixed(1)}M`} sub="Gross book value" icon={<DollarSign className="size-4" />} trend="neutral" />
        <StatCard title="Total Assets" value={String(kpi.totalCount)} sub={`Across ${categories.length} categories`} icon={<Building className="size-4" />} trend="neutral" />
        <StatCard title="Net Book Value" value={`$${kpi.currentNet.toFixed(1)}M`} sub="After depreciation" icon={<TrendingDown className="size-4" />} trend="down" />
        <StatCard title="Maint. Alerts" value={String(kpi.overdueCount)} sub="Overdue" icon={<AlertTriangle className="size-4" />} trend="down" />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="register">Asset Register</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Asset Value by Category" description="Gross book value ($M)" aiInsight={categories.length ? `${categories.length} categories` : "No data"}>
              <ChartContainer aspectRatio={1.6}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" nameKey="name"
                      label={({ name, value }: any) => `${name} $${(value as number).toFixed(1)}M`} labelLine={false}>
                      {categories.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>

            <Card>
              <CardHeader><CardTitle className="text-sm">Maintenance Alerts</CardTitle><CardDescription>Upcoming and overdue maintenance</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {maintenanceAlerts.length === 0 && <p className="text-xs text-center py-4" style={{ color: P.sub }}>No alerts</p>}
                {maintenanceAlerts.map((alert: any) => (
                  <div key={alert.asset} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: alert.status === "overdue" ? `${P.red}08` : P.bg, border: `1px solid ${alert.status === "overdue" ? `${P.red}20` : P.border}` }}>
                    <div className={`p-1.5 rounded-lg ${alert.status === "overdue" ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                      {alert.status === "overdue" ? <AlertTriangle size={12} style={{ color: P.red }} /> : <Calendar size={12} style={{ color: P.blue }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium" style={{ color: P.text }}>{alert.asset}</div>
                      <div className="text-xs mt-0.5" style={{ color: P.sub }}>{alert.type} — {alert.due}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]" style={{
                      background: alert.priority === "critical" ? `${P.red}15` : alert.priority === "high" ? `${P.amber}15` : `${P.blue}15`,
                      color: alert.priority === "critical" ? P.red : alert.priority === "high" ? P.amber : P.blue,
                      border: `1px solid ${alert.priority === "critical" ? `${P.red}30` : alert.priority === "high" ? `${P.amber}30` : `${P.blue}30`}`,
                    }}>{alert.priority}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Asset Register</CardTitle>
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-2.5" style={{ color: P.muted }} />
                  <Input placeholder="Search assets…" className="pl-8 h-8 text-xs w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assets.length === 0 && <p className="text-xs text-center py-6" style={{ color: P.sub }}>No assets found</p>}
                {assets.map((asset: CapexAsset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ background: `${P.blue}10` }}><Building size={14} style={{ color: P.blue }} /></div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: P.text }}>{asset.name}</div>
                        <div className="text-xs" style={{ color: P.sub }}>{asset.id} · {asset.category} · {asset.dept}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[10px]" style={{
                        background: asset.status === "Active" ? `${P.green}15` : asset.status === "Pending" ? `${P.amber}15` : `${P.muted}15`,
                        color: asset.status === "Active" ? P.green : asset.status === "Pending" ? P.amber : P.muted,
                        border: `1px solid ${asset.status === "Active" ? `${P.green}30` : asset.status === "Pending" ? `${P.amber}30` : `${P.muted}30`}`,
                      }}>{asset.status}</Badge>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono" style={{ color: P.blue }}>${asset.value.toFixed(1)}M</div>
                        {asset.nextMaint && <div className="text-[10px]" style={{ color: P.muted }}>{asset.nextMaint}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation">
          {depreciationSchedule.length === 0
            ? <p className="text-xs text-center py-12" style={{ color: P.sub }}>No depreciation data available</p>
            : (
              <ChartCard title="Depreciation Schedule" description="Gross, accumulated, and net book value" aiInsight="Annual tracking">
                <ChartContainer aspectRatio={2}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={depreciationSchedule}>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                      <XAxis dataKey="year" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="$" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="gross" name="Gross Value" fill={P.blue} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="accumulated" name="Accum. Depreciation" fill={P.amber} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="net" name="Net Book Value" fill={P.green} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </ChartCard>
            )}
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader><CardTitle className="text-sm">Maintenance Schedule</CardTitle><CardDescription>Upcoming preventive and corrective maintenance</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {maintenanceAlerts.length === 0 && <p className="text-xs text-center py-6" style={{ color: P.sub }}>No maintenance items</p>}
                {maintenanceAlerts.map((alert: any) => (
                  <div key={alert.asset} className="flex items-center justify-between p-3 rounded-lg" style={{ background: alert.status === "overdue" ? `${P.red}06` : P.bg, border: `1px solid ${alert.status === "overdue" ? `${P.red}20` : P.border}` }}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${alert.status === "overdue" ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                        {alert.status === "overdue" ? <AlertTriangle size={14} style={{ color: P.red }} /> : <Wrench size={14} style={{ color: P.blue }} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: P.text }}>{alert.asset}</div>
                        <div className="text-xs" style={{ color: P.sub }}>{alert.type} maintenance</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono" style={{ color: alert.status === "overdue" ? P.red : P.sub }}>{alert.due}</span>
                      <Badge variant="outline" className="text-[10px] capitalize" style={{ background: alert.status === "overdue" ? `${P.red}15` : `${P.green}15`, color: alert.status === "overdue" ? P.red : P.green, border: `1px solid ${alert.status === "overdue" ? `${P.red}30` : `${P.green}30`}` }}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
