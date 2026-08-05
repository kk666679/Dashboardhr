import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const complianceData = [
  { month: "Jan", compliant: 85, nonCompliant: 5 },
  { month: "Feb", compliant: 88, nonCompliant: 3 },
  { month: "Mar", compliant: 92, nonCompliant: 2 },
];

const riskDistribution = [
  { name: "Low", value: 40 },
  { name: "Medium", value: 30 },
  { name: "High", value: 20 },
  { name: "Critical", value: 10 },
];

export function ComplianceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Dashboard</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Regulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Non-Conformances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Audits Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Compliance Trend">
          <BarChart data={complianceData} xKey="month" yKey={["compliant", "nonCompliant"]} />
        </ChartCard>
        <ChartCard title="Risk Distribution">
          <PieChart data={riskDistribution} />
        </ChartCard>
      </div>
    </div>
  );
}
