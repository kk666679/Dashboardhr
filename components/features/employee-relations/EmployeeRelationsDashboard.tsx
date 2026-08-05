import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const grievanceData = [
  { month: "Jan", filed: 5, resolved: 3 },
  { month: "Feb", filed: 8, resolved: 6 },
  { month: "Mar", filed: 4, resolved: 4 },
];

const statusData = [
  { name: "Open", value: 12 },
  { name: "In Progress", value: 8 },
  { name: "Resolved", value: 20 },
];

export function EmployeeRelationsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Relations</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Grievances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Disciplinary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">6</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Investigations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Grievance Trend">
          <BarChart data={grievanceData} xKey="month" yKey={["filed", "resolved"]} />
        </ChartCard>
        <ChartCard title="Case Status Distribution">
          <PieChart data={statusData} />
        </ChartCard>
      </div>
    </div>
  );
}
