import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ChartCard } from "@/components/charts";

const completionData = [
  { month: "Jan", completed: 12, enrolled: 20 },
  { month: "Feb", completed: 18, enrolled: 25 },
  { month: "Mar", completed: 24, enrolled: 30 },
];

const categoryData = [
  { name: "Technical", value: 45 },
  { name: "Soft Skills", value: 30 },
  { name: "Leadership", value: 15 },
  { name: "Compliance", value: 10 },
];

export function LearningDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning & Development</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">74%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Certifications Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Monthly Progress">
          <BarChart data={completionData} xKey="month" yKey={["enrolled", "completed"]} stacked={false} />
        </ChartCard>
        <ChartCard title="Course Categories">
          <PieChart data={categoryData} />
        </ChartCard>
      </div>
    </div>
  );
}
