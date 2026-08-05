import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PerformanceData {
  employee: string;
  rating: number;
  status: "Exceeds" | "Meets" | "Below";
  reviewDate: string;
  comments?: string;
}

interface PerformanceOverviewProps {
  data: PerformanceData[];
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const avgRating = data.length ? data.reduce((s, d) => s + d.rating, 0) / data.length : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Performance</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Average Rating:</span>
          <span className="font-bold text-lg">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Date</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.employee}>
                  <TableCell>{d.employee}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={d.rating * 20} className="w-20" />
                      <span>{d.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.status === "Exceeds" ? "success" : d.status === "Meets" ? "warning" : "destructive"}>
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(d.reviewDate).toLocaleDateString()}</TableCell>
                  <TableCell>{d.comments || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
