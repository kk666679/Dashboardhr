import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ChartCard } from "@/components/charts";

interface TeamAnalyticsProps {
  attendance: { date: string; present: number; absent: number }[];
  leave: { month: string; taken: number; pending: number }[];
  performanceDistribution: { name: string; value: number }[];
}

export function TeamAnalytics({ attendance, leave, performanceDistribution }: TeamAnalyticsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Analytics</h2>
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Attendance Trend">
          <BarChart data={attendance} xKey="date" yKey={["present", "absent"]} stacked />
        </ChartCard>
        <ChartCard title="Leave Usage">
          <LineChart data={leave} xKey="month" yKey={["taken", "pending"]} />
        </ChartCard>
        <ChartCard title="Performance Distribution" className="col-span-2">
          <PieChart data={performanceDistribution} />
        </ChartCard>
      </div>
    </div>
  );
}
