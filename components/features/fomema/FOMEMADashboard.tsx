import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const examStatusData = [
  { month: "Jan", scheduled: 45, completed: 38, pending: 7 },
  { month: "Feb", scheduled: 52, completed: 42, pending: 10 },
  { month: "Mar", scheduled: 38, completed: 35, pending: 3 },
];

const workerStatusData = [
  { name: "Fit", value: 65 },
  { name: "Unfit", value: 12 },
  { name: "Under Treatment", value: 8 },
  { name: "Pending", value: 15 },
];

export function FOMEMADashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">FOMEMA Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Exams This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">38</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Monthly Exam Trend">
          <BarChart data={examStatusData} xKey="month" yKey={["scheduled", "completed", "pending"]} stacked />
        </ChartCard>
        <ChartCard title="Worker Health Status">
          <PieChart data={workerStatusData} />
        </ChartCard>
      </div>
    </div>
  );
}
