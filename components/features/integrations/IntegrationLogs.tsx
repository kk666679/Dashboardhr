import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  integration: string;
}

interface IntegrationLogsProps {
  logs: LogEntry[];
}

export function IntegrationLogs({ logs }: IntegrationLogsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input placeholder="Search logs..." className="max-w-sm" />
        <Input placeholder="Filter by integration..." className="max-w-sm" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Integration</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{log.integration}</TableCell>
              <TableCell>
                <Badge variant={log.level === "error" ? "destructive" : log.level === "warning" ? "warning" : "secondary"}>
                  {log.level}
                </Badge>
              </TableCell>
              <TableCell>{log.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
