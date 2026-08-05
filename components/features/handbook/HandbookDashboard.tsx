import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ChartCard } from "@/components/charts";
import { HandbookList } from "./HandbookList";

// Mock data – replace with real API calls
const recentHandbooks = [
  { id: "1", title: "Employee Code of Conduct", version: "3.2", updated: "2025-03-01", status: "Published" as const },
  { id: "2", title: "Remote Work Policy", version: "2.0", updated: "2025-02-15", status: "Draft" as const },
];

const activityData = [
  { month: "Jan", views: 120, edits: 5 },
  { month: "Feb", views: 180, edits: 8 },
  { month: "Mar", views: 210, edits: 12 },
];

export function HandbookDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Handbook Dashboard</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Handbooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Views & Edits">
          <BarChart data={activityData} xKey="month" yKey={["views", "edits"]} stacked={false} />
        </ChartCard>
        <Card>
          <CardHeader>
            <CardTitle>Recent Handbooks</CardTitle>
          </CardHeader>
          <CardContent>
            <HandbookList handbooks={recentHandbooks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
