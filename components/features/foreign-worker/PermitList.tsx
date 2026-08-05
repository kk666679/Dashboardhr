import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Permit {
  id: string;
  worker: string;
  type: string;
  issuedDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Renewed";
}

interface PermitListProps {
  permits: Permit[];
  onDelete?: (id: string) => void;
}

export function PermitList({ permits, onDelete }: PermitListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Issued</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permits.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.worker}</TableCell>
            <TableCell>{p.type}</TableCell>
            <TableCell>{new Date(p.issuedDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(p.expiryDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Active" ? "success" : p.status === "Expired" ? "destructive" : "warning"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {p.status === "Expired" && <Button variant="outline" size="sm">Renew</Button>}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
