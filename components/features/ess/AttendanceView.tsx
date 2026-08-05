import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "Late" | "Half Day" | "Holiday";
  hours: number;
}

interface AttendanceViewProps {
  records: AttendanceRecord[];
  month: string;
}

export function AttendanceView({ records, month }: AttendanceViewProps) {
  const present = records.filter(r => r.status === "Present").length;
  const total = records.length;
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance {month}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Attendance Rate:</span>
          <span className="font-bold text-lg">{attendanceRate}%</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.date}>
                  <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                  <TableCell>{r.checkIn || "-"}</TableCell>
                  <TableCell>{r.checkOut || "-"}</TableCell>
                  <TableCell>{r.hours || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Present" ? "success" : r.status === "Late" ? "warning" : "secondary"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
