import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const expiryData = [
  { month: "Jan", expiring: 3 },
  { month: "Feb", expiring: 5 },
  { month: "Mar", expiring: 2 },
];

const typeData = [
  { name: "Work Permit", value: 45 },
  { name: "Dependant", value: 20 },
  { name: "PR", value: 10 },
  { name: "Other", value: 5 },
];

export function PermitDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Permits Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Permits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">65</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Monthly Expiries">
          <BarChart data={expiryData} xKey="month" yKey="expiring" />
        </ChartCard>
        <ChartCard title="Permit Types">
          <PieChart data={typeData} />
        </ChartCard>
      </div>
    </div>
  );
}
