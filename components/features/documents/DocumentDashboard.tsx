import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const docActivityData = [
  { month: "Jan", created: 12, signed: 8 },
  { month: "Feb", created: 18, signed: 14 },
  { month: "Mar", created: 15, signed: 12 },
];

const docStatusData = [
  { name: "Draft", value: 25 },
  { name: "Pending Sign", value: 15 },
  { name: "Signed", value: 30 },
  { name: "Archived", value: 10 },
];

export function DocumentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Templates Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Generated This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Document Activity">
          <BarChart data={docActivityData} xKey="month" yKey={["created", "signed"]} />
        </ChartCard>
        <ChartCard title="Document Status">
          <PieChart data={docStatusData} />
        </ChartCard>
      </div>
    </div>
  );
}
