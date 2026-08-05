"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartCard, BarChart, LineChart, PieChart } from "@/components/charts";
import { AutomationNavigation } from "@/components/features/automation/navigation";

const THROUGHPUT_DATA = [
  { month: "Jan", completed: 42, failed: 3 },
  { month: "Feb", completed: 58, failed: 5 },
  { month: "Mar", completed: 71, failed: 2 },
  { month: "Apr", completed: 65, failed: 4 },
  { month: "May", completed: 88, failed: 1 },
];

const AVG_DURATION_DATA = [
  { month: "Jan", minutes: 6.2 },
  { month: "Feb", minutes: 5.8 },
  { month: "Mar", minutes: 4.9 },
  { month: "Apr", minutes: 5.1 },
  { month: "May", minutes: 4.2 },
];

const BY_MODULE_DATA = [
  { name: "Leave Approval", value: 38 },
  { name: "Onboarding", value: 22 },
  { name: "Payroll Run", value: 18 },
  { name: "Permit Renewal", value: 12 },
  { name: "Other", value: 10 },
];

const TOP_BOTTLENECKS = [
  { step: "Manager Approval", avgWait: "18 min", occurrences: 34 },
  { step: "Document Review", avgWait: "12 min", occurrences: 21 },
  { step: "Final Sign-off", avgWait: "9 min", occurrences: 15 },
];

const KPI_CARDS = [
  { label: "Total Executions", value: "324", delta: "+12%", positive: true },
  { label: "Success Rate", value: "97.2%", delta: "+0.8%", positive: true },
  { label: "Avg. Duration", value: "4.2 min", delta: "-0.9 min", positive: true },
  { label: "SLA Breaches", value: "4", delta: "-2", positive: true },
];

export default function AutomationAnalyticsPage() {
  return (
    <div className="space-y-6">
      <AutomationNavigation />
      <div>
        <p className="text-muted-foreground">
          Workflow performance metrics, throughput trends, and bottleneck analysis
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpi.value}</div>
              <Badge variant={kpi.positive ? "secondary" : "destructive"} className="text-xs">
                {kpi.delta}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Workflow Throughput">
          <BarChart data={THROUGHPUT_DATA} xKey="month" yKey={["completed", "failed"]} />
        </ChartCard>
        <ChartCard title="Average Execution Duration (min)">
          <LineChart data={AVG_DURATION_DATA} xKey="month" yKey={["minutes"]} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Executions by Module">
          <PieChart data={BY_MODULE_DATA} />
        </ChartCard>

        {/* Bottleneck table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Bottlenecks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TOP_BOTTLENECKS.map((b) => (
                <div
                  key={b.step}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{b.step}</p>
                    <p className="text-xs text-muted-foreground">{b.occurrences} occurrences</p>
                  </div>
                  <Badge variant="warning" className="text-xs">
                    avg {b.avgWait}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
