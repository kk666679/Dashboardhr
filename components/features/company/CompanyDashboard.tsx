import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, ChartCard } from "@/components/charts";

const companyGrowthData = [
  { month: "Jan", employees: 120, departments: 8 },
  { month: "Feb", employees: 130, departments: 9 },
  { month: "Mar", employees: 150, departments: 10 },
];

const departmentDistribution = [
  { name: "Engineering", value: 40 },
  { name: "Sales", value: 25 },
  { name: "HR", value: 15 },
  { name: "Finance", value: 12 },
  { name: "Operations", value: 8 },
];

export function CompanyDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Management</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Company Growth">
          <BarChart data={companyGrowthData} xKey="month" yKey={["employees", "departments"]} />
        </ChartCard>
        <ChartCard title="Department Distribution">
          <PieChart data={departmentDistribution} />
        </ChartCard>
      </div>
    </div>
  );
}
