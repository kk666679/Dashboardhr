import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";
import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";

const integrationData = [
  { month: "Jan", success: 45, failures: 5 },
  { month: "Feb", success: 52, failures: 3 },
  { month: "Mar", success: 48, failures: 4 },
];

const statusData = [
  { name: "Connected", value: 12 },
  { name: "Disconnected", value: 4 },
  { name: "Error", value: 3 },
];

export function IntegrationDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integration Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Integrations</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Disconnected</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Avg. Sync Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4s</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Integration Activity">
          <BarChart data={integrationData} xKey="month" yKey={["success", "failures"]} />
        </ChartCard>
        <ChartCard title="Status Distribution">
          <PieChart data={statusData} />
        </ChartCard>
      </div>
    </div>
  );
}
