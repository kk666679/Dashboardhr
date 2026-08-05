"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ChartCard } from "@/components/charts";

const qualityMetrics = [
  { month: "Jan", nonConformances: 12, resolved: 8 },
  { month: "Feb", nonConformances: 9, resolved: 9 },
  { month: "Mar", nonConformances: 15, resolved: 12 },
];

const auditStatusData = [
  { name: "Passed", value: 45 },
  { name: "With Findings", value: 25 },
  { name: "Failed", value: 5 },
  { name: "Scheduled", value: 15 },
];

export function QMSDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quality Management System</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open CAPAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Audits Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Non-Conformance Trend">
          <BarChart data={qualityMetrics} xKey="month" yKey={["nonConformances", "resolved"]} />
        </ChartCard>
        <ChartCard title="Audit Status Distribution">
          <PieChart data={auditStatusData} />
        </ChartCard>
      </div>
    </div>
  );
}
