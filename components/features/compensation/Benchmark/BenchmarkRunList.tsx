import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SalaryBenchmarkRun {
  id: string;
  sourceId: string;
  runDate: string | Date;
  status: string;
  results?: unknown[];
  [key: string]: unknown;
}

interface BenchmarkRunListProps {
  runs: SalaryBenchmarkRun[];
  onRun?: (sourceId: string) => void;
}

export function BenchmarkRunList({ runs, onRun }: BenchmarkRunListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Run Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Results</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.sourceId}</TableCell>
            <TableCell>{new Date(r.runDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={r.status === "COMPLETED" ? "success" : r.status === "FAILED" ? "destructive" : "warning"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell>{r.results?.length || 0}</TableCell>
            <TableCell className="text-right">
              {r.status !== "RUNNING" && onRun && (
                <Button size="sm" onClick={() => onRun(r.sourceId)}>Run Again</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
