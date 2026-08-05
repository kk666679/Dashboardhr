"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Building, Wrench,
  Calendar, AlertTriangle, CheckCircle2, Search, Plus, Filter,
} from "lucide-react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const P = {
  blue: "#00d4ff", purple: "#7c5cfc", green: "#00d68f",
  amber: "#ffaa00", red: "#ff4d6d", muted: "#4d5468",
  text: "#f0f2f7", sub: "#8b92a9", bg: "#0f1117", card: "#161820",
  border: "rgba(255,255,255,0.06)",
};

const assetCategories = [
  { name: "Machinery & Equipment", value: 12.4, count: 48, color: P.blue },
  { name: "Vehicles", value: 4.8, count: 22, color: P.green },
  { name: "IT & Technology", value: 3.6, count: 185, color: P.purple },
  { name: "Buildings & Facilities", value: 8.2, count: 6, color: P.amber },
  { name: "Furniture & Fixtures", value: 1.8, count: 340, color: P.red },
  { name: "Lab Equipment", value: 2.1, count: 64, color: P.muted },
];

const depreciationSchedule = [
  { year: "2021", gross: 28.4, accumulated: 8.2, net: 20.2 },
  { year: "2022", gross: 30.2, accumulated: 10.4, net: 19.8 },
  { year: "2023", gross: 32.8, accumulated: 12.9, net: 19.9 },
  { year: "2024", gross: 34.6, accumulated: 15.1, net: 19.5 },
  { year: "2025", gross: 36.2, accumulated: 17.4, net: 18.8 },
  { year: "2026", gross: 38.5, accumulated: 19.8, net: 18.7 },
];

const maintenanceAlerts = [
  { asset: "Press #3 Hydraulic System", type: "Preventive", due: "Aug 15, 2026", status: "scheduled", priority: "high" },
  { asset: "Forklift FL-04", type: "Repair", due: "Overdue (Jul 20)", status: "overdue", priority: "critical" },
  { asset: "HVAC Unit — QC Wing", type: "Preventive", due: "Aug 1, 2026", status: "scheduled", priority: "medium" },
  { asset: "CNC Machine #7", type: "Calibration", due: "Aug 22, 2026", status: "scheduled", priority: "low" },
];

const topAssets = [
  { id: "ASSET-001", name: "Press Line #3", category: "Machinery", value: 2.8, dept: "Operations", status: "Active", nextMaint: "Aug 10, 2026" },
  { id: "ASSET-002", name: "Warehouse Block C", category: "Buildings", value: 4.2, dept: "Facilities", status: "Active", nextMaint: "Sep 5, 2026" },
  { id: "ASSET-003", name: "ERP Server Cluster", category: "IT", value: 1.2, dept: "IT", status: "Active", nextMaint: "Jul 28, 2026" },
  { id: "ASSET-004", name: "CNC 5-Axis Machine", category: "Machinery", value: 0.9, dept: "Engineering", status: "Inactive", nextMaint: "N/A" },
  { id: "ASSET-005", name: "Fleet — 10 EV Units", category: "Vehicles", value: 1.0, dept: "Logistics", status: "Pending", nextMaint: "N/A" },
];

const totalValue = assetCategories.reduce((a, c) => a + c.value, 0);
const totalAssets = assetCategories.reduce((a, c) => a + c.count, 0);
const currentNetBook = depreciationSchedule[depreciationSchedule.length - 1].net;

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

export default function CapexAssetsPage() {
  const [search, setSearch] = useState("");

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

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Total Asset Value" value={`$${totalValue.toFixed(1)}M`} sub="Gross book value" icon={<DollarSign className="size-4" />} trend="neutral" />
        <StatCard title="Total Assets" value={totalAssets.toString()} sub="Across 6 categories" icon={<Building className="size-4" />} trend="neutral" />
        <StatCard title="Net Book Value" value={`$${currentNetBook.toFixed(1)}M`} sub="After accumulated depreciation" icon={<TrendingDown className="size-4" />} trend="down" />
        <StatCard title="Maint. Alerts" value={maintenanceAlerts.filter((a) => a.status === "overdue").length.toString()} sub="Overdue" icon={<AlertTriangle className="size-4" />} trend="down" />
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
            <ChartCard title="Asset Value by Category" description="Gross book value ($M)" aiInsight="Machinery is 40%">
              <ChartContainer aspectRatio={1.6}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={assetCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" nameKey="name"
                      label={({ name, value }: any) => `${name} $${value.toFixed(1)}M`} labelLine={false}>
                      {assetCategories.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>

            {/* Maintenance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Maintenance Alerts</CardTitle>
                <CardDescription>Upcoming and overdue maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {maintenanceAlerts.map((alert) => (
                  <div key={alert.asset} className="flex items-start gap-3 p-3 rounded-lg" style={{
                    background: alert.status === "overdue" ? `${P.red}08` : P.bg,
                    border: `1px solid ${alert.status === "overdue" ? `${P.red}20` : P.border}`,
                  }}>
                    <div className={`p-1.5 rounded-lg ${alert.status === "overdue" ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                      {alert.status === "overdue" ? <AlertTriangle size={12} style={{ color: P.red }} /> : <Calendar size={12} style={{ color: P.blue }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium" style={{ color: P.text }}>{alert.asset}</div>
                      <div className="text-xs mt-0.5" style={{ color: P.sub }}>
                        {alert.type} — {alert.due}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]" style={{
                      background: alert.priority === "critical" ? `${P.red}15` : alert.priority === "high" ? `${P.amber}15` : `${P.blue}15`,
                      color: alert.priority === "critical" ? P.red : alert.priority === "high" ? P.amber : P.blue,
                      border: `1px solid ${alert.priority === "critical" ? `${P.red}30` : alert.priority === "high" ? `${P.amber}30` : `${P.blue}30`}`,
                    }}>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Asset by Category Bar */}
          <ChartCard title="Asset Count by Category" description="Number of assets per category">
            <ChartContainer aspectRatio={2.5}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetCategories}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                  <XAxis dataKey="name" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Asset Count" fill={P.blue} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="value" name="Value ($M)" fill={P.green} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Asset Register</CardTitle>
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-2.5" style={{ color: P.muted }} />
                  <Input placeholder="Search assets..." className="pl-8 h-8 text-xs w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topAssets.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ background: `${P.blue}10` }}>
                        <Building size={14} style={{ color: P.blue }} />
                      </div>
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
                      }}>
                        {asset.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono" style={{ color: P.blue }}>${asset.value.toFixed(1)}M</div>
                        <div className="text-[10px]" style={{ color: P.muted }}>{asset.nextMaint}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation" className="space-y-4">
          <ChartCard title="Depreciation Schedule" description="Gross, accumulated, and net book value over time" aiInsight="Net book value stabilizing at ~$19M">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Depreciation Summary</CardTitle>
              <CardDescription>Current period depreciation details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Depreciation Method", value: "Straight Line", color: P.blue },
                  { label: "Avg Useful Life", value: "12.4 years", color: P.purple },
                  { label: "Annual Depreciation", value: "$3.2M", color: P.amber },
                  { label: "Monthly Depreciation", value: "$267K", color: P.green },
                  { label: "Remaining Life (Avg)", value: "5.8 years", color: P.muted },
                  { label: "Salvage Value (Est.)", value: "$4.2M", color: P.red },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-lg" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
                    <div className="text-xs" style={{ color: P.sub }}>{m.label}</div>
                    <div className="text-sm font-bold font-mono mt-1" style={{ color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming preventive and corrective maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {maintenanceAlerts.map((alert) => (
                  <div key={alert.asset} className="flex items-center justify-between p-3 rounded-lg" style={{
                    background: alert.status === "overdue" ? `${P.red}06` : P.bg,
                    border: `1px solid ${alert.status === "overdue" ? `${P.red}20` : P.border}`,
                  }}>
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
                      <span className="text-xs font-mono" style={{
                        color: alert.status === "overdue" ? P.red : P.sub,
                      }}>{alert.due}</span>
                      <Badge variant="outline" className="text-[10px] capitalize" style={{
                        background: alert.status === "overdue" ? `${P.red}15` : `${P.green}15`,
                        color: alert.status === "overdue" ? P.red : P.green,
                        border: `1px solid ${alert.status === "overdue" ? `${P.red}30` : `${P.green}30`}`,
                      }}>
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

