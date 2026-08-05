import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const terminationData = [
  { month: "Jan", voluntary: 8, involuntary: 3, retirement: 2 },
  { month: "Feb", voluntary: 6, involuntary: 4, retirement: 1 },
  { month: "Mar", voluntary: 10, involuntary: 2, retirement: 3 },
];

const statusData = [
  { name: "Initiated", value: 15 },
  { name: "In Progress", value: 12 },
  { name: "Clearance", value: 8 },
  { name: "Completed", value: 20 },
];

export function TerminationDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Termination Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Terminations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">27</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">20</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Clearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Exit Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Termination Trends">
          <BarChart data={terminationData} xKey="month" yKey={["voluntary", "involuntary", "retirement"]} stacked />
        </ChartCard>
        <ChartCard title="Case Status Distribution">
          <PieChart data={statusData} />
        </ChartCard>
      </div>
    </div>
  );
}
