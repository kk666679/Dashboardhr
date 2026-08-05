import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ChartCard } from "@/components/charts";

const mockReviews = [
  { id: "1", employee: "Ahmad Ali", reviewer: "Manager A", date: "2025-03-01", rating: 4.5, status: "Completed" },
  { id: "2", employee: "Siti Aisyah", reviewer: "Manager B", date: "2025-02-15", rating: 3.8, status: "In Progress" },
];

const performanceData = [
  { month: "Jan", avgRating: 3.8, goalsCompleted: 12 },
  { month: "Feb", avgRating: 4.1, goalsCompleted: 15 },
  { month: "Mar", avgRating: 4.3, goalsCompleted: 18 },
];

export function PerformanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 / 5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Reviews Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Goals Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">45</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Performance Trends">
          <LineChart data={performanceData} xKey="month" yKey={["avgRating", "goalsCompleted"]} />
        </ChartCard>
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockReviews.map((r) => (
                <div key={r.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{r.employee}</p>
                    <p className="text-sm text-muted-foreground">{r.reviewer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{r.rating}</p>
                    <p className="text-sm text-muted-foreground">{r.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
