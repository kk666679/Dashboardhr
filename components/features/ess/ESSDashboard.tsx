import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ChartCard } from "@/components/charts";
import { Loader2 } from "lucide-react";

export interface ESSDashboardProps {
  availableLeaveDays?: number;
  pendingRequests?: number;
  attendanceRate?: number;
  upcomingHolidays?: number;
  leaveTrend?: { month: string; taken: number; remaining: number }[];
  weeklyAttendance?: { day: string; present: number; absent: number }[];
  isLoading?: boolean;
}

export function ESSDashboard({
  availableLeaveDays = 0,
  pendingRequests = 0,
  attendanceRate = 0,
  upcomingHolidays = 0,
  leaveTrend = [],
  weeklyAttendance = [],
  isLoading = false,
}: ESSDashboardProps) {
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
        <h2 className="text-2xl font-bold text-slate-900">Employee Self-Service</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Available Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableLeaveDays} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Attendance This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingHolidays}</div>
          </CardContent>
        </Card>
      </div>

      {(leaveTrend.length > 0 || weeklyAttendance.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaveTrend.length > 0 && (
            <ChartCard title="Leave Balance Trend">
              <LineChart data={leaveTrend} xKey="month" yKey={["taken", "remaining"]} />
            </ChartCard>
          )}
          {weeklyAttendance.length > 0 && (
            <ChartCard title="Weekly Attendance">
              <BarChart data={weeklyAttendance} xKey="day" yKey={["present", "absent"]} stacked />
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}
