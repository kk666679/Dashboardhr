import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartCard, LineChart } from "@/components/charts";

interface HistoryRecord {
  id: string;
  userId: string;
  userName: string;
  lat: number;
  lng: number;
  timestamp: string;
  accuracy: number;
  device: string;
}

interface LocationHistoryProps {
  records: HistoryRecord[];
  onExport?: () => void;
}

export function LocationHistory({ records, onExport }: LocationHistoryProps) {
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");

  const filtered = records.filter(r =>
    r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.device.toLowerCase().includes(search.toLowerCase())
  );

  // Prepare chart data (group by date)
  const chartData = records.reduce((acc, r) => {
    const date = new Date(r.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const chartDataArray = Object.entries(chartData).map(([date, count]) => ({ date, count }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Location History</h3>
        <Button variant="outline" size="sm" onClick={onExport}>Export</Button>
      </div>

      {chartDataArray.length > 0 && (
        <ChartCard title="Location Updates Over Time">
          <LineChart data={chartDataArray} xKey="date" yKey="count" />
        </ChartCard>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Search by user or device..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Device</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.slice(0, 50).map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.userName}</TableCell>
              <TableCell>{r.lat.toFixed(6)}</TableCell>
              <TableCell>{r.lng.toFixed(6)}</TableCell>
              <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
              <TableCell>{r.accuracy}m</TableCell>
              <TableCell>{r.device}</TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No location records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
