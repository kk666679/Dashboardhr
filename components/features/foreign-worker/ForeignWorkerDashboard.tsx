import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const workerStatusData = [
  { month: "Jan", active: 120, pending: 15, expired: 5 },
  { month: "Feb", active: 125, pending: 12, expired: 8 },
  { month: "Mar", active: 130, pending: 10, expired: 6 },
];

const nationalityData = [
  { name: "Indonesia", value: 45 },
  { name: "Philippines", value: 30 },
  { name: "Vietnam", value: 20 },
  { name: "Bangladesh", value: 15 },
  { name: "Myanmar", value: 10 },
];

export function ForeignWorkerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Foreign Worker Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">130</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Permits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">105</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Permits Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medical Checkups Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Worker Status Trend">
          <BarChart data={workerStatusData} xKey="month" yKey={["active", "pending", "expired"]} stacked />
        </ChartCard>
        <ChartCard title="Nationality Distribution">
          <PieChart data={nationalityData} />
        </ChartCard>
      </div>
    </div>
  );
}
