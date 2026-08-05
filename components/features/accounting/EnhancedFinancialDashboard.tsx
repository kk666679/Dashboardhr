import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ChartCard } from "@/components/charts";

const revenueData = [
  { month: "Jan", revenue: 12000, expenses: 8000 },
  { month: "Feb", revenue: 15000, expenses: 9000 },
  { month: "Mar", revenue: 18000, expenses: 10000 },
];

const expenseCategories = [
  { name: "Salaries", value: 45 },
  { name: "Operations", value: 25 },
  { name: "Marketing", value: 15 },
  { name: "Administrative", value: 15 },
];

const cashFlowData = [
  { month: "Jan", inflow: 14000, outflow: 11000 },
  { month: "Feb", inflow: 16000, outflow: 12000 },
  { month: "Mar", inflow: 19000, outflow: 13000 },
];

export function EnhancedFinancialDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Dashboard</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$18,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Expenses (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$10,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$8,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,000</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Revenue vs Expenses">
          <BarChart data={revenueData} xKey="month" yKey={["revenue", "expenses"]} />
        </ChartCard>
        <ChartCard title="Expense Distribution">
          <PieChart data={expenseCategories} />
        </ChartCard>
      </div>

      <ChartCard title="Cash Flow Trend">
        <LineChart data={cashFlowData} xKey="month" yKey={["inflow", "outflow"]} />
      </ChartCard>
    </div>
  );
}
