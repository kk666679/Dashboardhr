import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const caseData = [
  { month: "Jan", new: 3, resolved: 2 },
  { month: "Feb", new: 5, resolved: 4 },
  { month: "Mar", new: 2, resolved: 3 },
];

const typeData = [
  { name: "Grievance", value: 12 },
  { name: "Dispute", value: 8 },
  { name: "Union", value: 5 },
  { name: "Other", value: 3 },
];

export function IndustrialRelationsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Industrial Relations</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resolved (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Unions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mediation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Case Activity">
          <BarChart data={caseData} xKey="month" yKey={["new", "resolved"]} stacked={false} />
        </ChartCard>
        <ChartCard title="Case Types">
          <PieChart data={typeData} />
        </ChartCard>
      </div>
    </div>
  );
}
