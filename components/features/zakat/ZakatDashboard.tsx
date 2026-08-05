import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const zakatData = [
  { month: "Jan", collected: 12000, distributed: 8000 },
  { month: "Feb", collected: 15000, distributed: 12000 },
  { month: "Mar", collected: 18000, distributed: 15000 },
];

const distributionData = [
  { name: "Poor", value: 40 },
  { name: "Needy", value: 25 },
  { name: "Debtors", value: 15 },
  { name: "Travelers", value: 10 },
  { name: "Administration", value: 10 },
];

export function ZakatDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Zakat Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">RM 45,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">RM 35,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">RM 10,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eligible Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Zakat Collection & Distribution">
          <BarChart data={zakatData} xKey="month" yKey={["collected", "distributed"]} />
        </ChartCard>
        <ChartCard title="Distribution Categories">
          <PieChart data={distributionData} />
        </ChartCard>
      </div>
    </div>
  );
}
