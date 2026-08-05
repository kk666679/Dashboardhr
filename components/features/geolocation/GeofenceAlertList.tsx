import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  user: string;
  geofence: string;
  type: "Enter" | "Exit";
  timestamp: string;
  status: "New" | "Acknowledged" | "Resolved";
}

interface GeofenceAlertListProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export function GeofenceAlertList({ alerts, onAcknowledge, onResolve }: GeofenceAlertListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Geofence</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.user}</TableCell>
            <TableCell>{a.geofence}</TableCell>
            <TableCell>
              <Badge variant={a.type === "Enter" ? "success" : "destructive"}>
                {a.type}
              </Badge>
            </TableCell>
            <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={a.status === "New" ? "warning" : a.status === "Acknowledged" ? "secondary" : "success"}>
                {a.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              {a.status === "New" && (
                <Button size="sm" onClick={() => onAcknowledge?.(a.id)}>Acknowledge</Button>
              )}
              {a.status === "Acknowledged" && (
                <Button size="sm" variant="outline" onClick={() => onResolve?.(a.id)}>Resolve</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
