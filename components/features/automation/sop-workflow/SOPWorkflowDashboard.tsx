"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const sopData = [
  { month: "Jan", created: 5, completed: 3 },
  { month: "Feb", created: 8, completed: 6 },
  { month: "Mar", created: 6, completed: 5 },
];

const statusData = [
  { name: "Draft", value: 8 },
  { name: "Published", value: 12 },
  { name: "Archived", value: 5 },
];

export function SOPWorkflowDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SOP Workflow</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total SOPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">6</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="SOP Creation Trend">
          <BarChart data={sopData} xKey="month" yKey={["created", "completed"]} />
        </ChartCard>
        <ChartCard title="Status Distribution">
          <PieChart data={statusData} />
        </ChartCard>
      </div>
    </div>
  );
}
