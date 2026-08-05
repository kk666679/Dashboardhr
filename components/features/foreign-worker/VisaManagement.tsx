import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Visa {
  id: string;
  worker: string;
  visaType: string;
  issuedDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Renewed";
}

interface VisaManagementProps {
  visas: Visa[];
  onDelete?: (id: string) => void;
}

export function VisaManagement({ visas, onDelete }: VisaManagementProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Visa Type</TableHead>
          <TableHead>Issued</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visas.map((v) => (
          <TableRow key={v.id}>
            <TableCell>{v.worker}</TableCell>
            <TableCell>{v.visaType}</TableCell>
            <TableCell>{new Date(v.issuedDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(v.expiryDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={v.status === "Active" ? "success" : v.status === "Expired" ? "destructive" : "warning"}>
                {v.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {v.status === "Expired" && <Button variant="outline" size="sm">Renew</Button>}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(v.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
