"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart, ChartCard } from "@/components/charts";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, Users, BarChart2, Target, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ATTRITION_TREND = [
  { month: "Mar", voluntary: 2, involuntary: 0 },
  { month: "Apr", voluntary: 1, involuntary: 1 },
  { month: "May", voluntary: 3, involuntary: 0 },
  { month: "Jun", voluntary: 1, involuntary: 0 },
  { month: "Jul", voluntary: 2, involuntary: 1 },
  { month: "Aug", voluntary: 1, involuntary: 0 },
];

const HEADCOUNT_TREND = [
  { month: "Mar", headcount: 38 },
  { month: "Apr", headcount: 39 },
  { month: "May", headcount: 40 },
  { month: "Jun", headcount: 41 },
  { month: "Jul", headcount: 41 },
  { month: "Aug", headcount: 42 },
];

const DIVERSITY_DATA = [
  { name: "Malaysian", value: 28 },
  { name: "Foreign Worker", value: 8 },
  { name: "Expatriate", value: 6 },
];

const APPROVAL_EFFICIENCY = [
  { type: "Leave", avgHours: 2.1, slaTarget: 24 },
  { type: "Claims", avgHours: 8.4, slaTarget: 48 },
  { type: "Travel", avgHours: 12.3, slaTarget: 48 },
  { type: "Overtime", avgHours: 1.8, slaTarget: 12 },
];

const UTILISATION_DATA = [
  { dept: "Engineering", utilisation: 94 },
  { dept: "Design", utilisation: 78 },
  { dept: "QA", utilisation: 85 },
  { dept: "DevOps", utilisation: 91 },
];

export function AdvancedAnalytics() {
  const { data: headcount, isLoading } = trpc.analytics.getHeadcountSummary.useQuery({});
  const { data: turnover } = trpc.analytics.getTurnoverRate.useQuery({ months: 12 });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time workforce, manager, and operational analytics</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Headcount", value: isLoading ? "—" : (headcount?.active ?? "—"), sub: "active employees", icon: Users, color: "text-blue-600" },
          { label: "Turnover Rate", value: isLoading ? "—" : `${turnover?.turnoverRatePct ?? "—"}%`, sub: "last 12 months", icon: TrendingDown, color: "text-red-600" },
          { label: "Avg Tenure", value: "3.4 yrs", sub: "team average", icon: Target, color: "text-emerald-600" },
          { label: "Utilisation", value: "88%", sub: "team capacity", icon: BarChart2, color: "text-violet-600" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="workforce">
        <TabsList className="grid grid-cols-3 h-9">
          <TabsTrigger value="workforce" className="text-xs">Workforce</TabsTrigger>
          <TabsTrigger value="manager" className="text-xs">Manager</TabsTrigger>
          <TabsTrigger value="operations" className="text-xs">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="workforce" className="space-y-4 mt-3">
          <ChartCard title="Headcount Trend">
            <LineChart data={HEADCOUNT_TREND} xKey="month" yKey={["headcount"]} />
          </ChartCard>
          <ChartCard title="Attrition by Type">
            <BarChart data={ATTRITION_TREND} xKey="month" yKey={["voluntary", "involuntary"]} />
          </ChartCard>
          <ChartCard title="Workforce Composition">
            <PieChart data={DIVERSITY_DATA} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="manager" className="space-y-4 mt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Approval Efficiency vs. SLA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {APPROVAL_EFFICIENCY.map((item) => {
                const pct = Math.min((item.avgHours / item.slaTarget) * 100, 100);
                const onTime = item.avgHours <= item.slaTarget * 0.5;
                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">avg {item.avgHours}h / SLA {item.slaTarget}h</span>
                        <Badge className={cn("text-[10px] border-0", onTime ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                          {onTime ? "Fast" : "Moderate"}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", onTime ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Coaching Sessions", value: "12", sub: "this quarter", color: "text-blue-600" },
              { label: "1:1 Completion", value: "87%", sub: "of scheduled", color: "text-emerald-600" },
              { label: "Team NPS", value: "+34", sub: "manager score", color: "text-violet-600" },
              { label: "Escalations", value: "2", sub: "open cases", color: "text-amber-600" },
            ].map(({ label, value, sub, color }) => (
              <Card key={label} className="p-3 text-center">
                <div className={cn("text-xl font-bold", color)}>{value}</div>
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] text-muted-foreground">{sub}</div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4 mt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Team Utilisation by Department</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {UTILISATION_DATA.map((item) => (
                <div key={item.dept} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.dept}</span>
                    <span className={cn("text-xs font-bold", item.utilisation >= 90 ? "text-red-600" : item.utilisation >= 75 ? "text-amber-600" : "text-emerald-600")}>
                      {item.utilisation}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", item.utilisation >= 90 ? "bg-red-500" : item.utilisation >= 75 ? "bg-amber-500" : "bg-emerald-500")}
                      style={{ width: `${item.utilisation}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Overtime Hours", value: "124h", sub: "this month" },
              { label: "Absence Rate", value: "3.2%", sub: "vs 4.1% avg" },
              { label: "Cost per Hire", value: "RM 8.4K", sub: "last 3 hires" },
            ].map(({ label, value, sub }) => (
              <Card key={label} className="p-3">
                <div className="text-lg font-bold">{value}</div>
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] text-muted-foreground">{sub}</div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
