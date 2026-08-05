import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ChartCard } from "@/components/charts";
import { Loader2 } from "lucide-react";

export interface MSSDashboardProps {
  teamSize?: number;
  pendingApprovals?: number;
  attendanceRate?: number;
  openPositions?: number;
  teamGrowth?: { month: string; members: number; newHires: number }[];
  approvalsByType?: { name: string; value: number }[];
  isLoading?: boolean;
}

export function MSSDashboard({
  teamSize = 0,
  pendingApprovals = 0,
  attendanceRate = 0,
  openPositions = 0,
  teamGrowth = [],
  approvalsByType = [],
  isLoading = false,
}: MSSDashboardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manager Self-Service</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamSize}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingApprovals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Team Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openPositions}</div>
          </CardContent>
        </Card>
      </div>

      {(teamGrowth.length > 0 || approvalsByType.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamGrowth.length > 0 && (
            <ChartCard title="Team Growth">
              <LineChart data={teamGrowth} xKey="month" yKey={["members", "newHires"]} />
            </ChartCard>
          )}
          {approvalsByType.length > 0 && (
            <ChartCard title="Approvals by Type">
              <PieChart data={approvalsByType} />
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}
