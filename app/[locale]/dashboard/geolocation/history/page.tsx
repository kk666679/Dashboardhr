"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartCard } from "@/components/charts/ChartCard";
import { LineChart } from "@/components/charts/LineChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  MapPin,
  Download,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HistoryPage() {
  const { useLocationHistory } = useGeolocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  // Example: you'd replace with actual employeeId from context
  const { data, isLoading } = useLocationHistory({
    userId: "demo-user",
    limit: pageSize,
    offset: page * pageSize,
  });

  const records = (data as any)?.records ?? [];
  const total = (data as any)?.total ?? 0;
  const hasMore = (data as any)?.hasMore ?? false;

  // Chart data grouped by date
  const chartMap: Record<string, number> = {};
  records.forEach((r: any) => {
    const date = new Date(r.timestamp).toLocaleDateString();
    chartMap[date] = (chartMap[date] ?? 0) + 1;
  });
  const chartData = Object.entries(chartMap).map(([date, count]) => ({ date, count }));

  const handleExport = () => {
    const csv = [
      ["Timestamp", "Latitude", "Longitude", "Accuracy", "Source", "Battery"].join(","),
      ...records.map((r: any) =>
        [r.timestamp, r.latitude, r.longitude, r.accuracy, r.source, r.batteryLevel].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `location-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = records.filter((r: any) =>
    !searchTerm ||
    r.latitude.toFixed(4).includes(searchTerm) ||
    r.longitude.toFixed(4).includes(searchTerm) ||
    r.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageShell>
      <PageHeader
        title="Location History"
        description="Browse, search, and export historical location data"
        actions={
          <Button variant="outline" size="sm" onClick={handleExport} disabled={records.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        }
      />

      {/* Chart */}
      {chartData.length > 0 && (
        <ChartCard title="Location Updates Over Time" description="Number of location records per day">
          <LineChart data={chartData} xKey="date" yKey="count" />
        </ChartCard>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by coordinates or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {total} total records
        </span>
      </div>

      {/* History Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Battery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No location records found
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(r.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.latitude.toFixed(6)}</TableCell>
                      <TableCell className="font-mono text-xs">{r.longitude.toFixed(6)}</TableCell>
                      <TableCell className="text-xs">±{r.accuracy?.toFixed(0) ?? "?"}m</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{r.source ?? "GPS"}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {r.batteryLevel != null ? `${r.batteryLevel}%` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasMore}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}

