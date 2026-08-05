import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "Connected" | "Disconnected" | "Error";
  lastSync: string;
}

interface IntegrationListProps {
  integrations: Integration[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function IntegrationList({ integrations, onDelete, onEdit }: IntegrationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Sync</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {integrations.map((i) => (
          <TableRow key={i.id}>
            <TableCell>{i.name}</TableCell>
            <TableCell>{i.type}</TableCell>
            <TableCell>
              <Badge variant={i.status === "Connected" ? "success" : i.status === "Error" ? "destructive" : "secondary"}>
                {i.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(i.lastSync).toLocaleString()}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(i.id)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete?.(i.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
