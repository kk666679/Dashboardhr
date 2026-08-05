import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Agreement {
  id: string;
  title: string;
  union: string;
  effectiveDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Negotiating";
}

interface CollectiveAgreementListProps {
  agreements: Agreement[];
  onDelete?: (id: string) => void;
}

export function CollectiveAgreementList({ agreements, onDelete }: CollectiveAgreementListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Union</TableHead>
          <TableHead>Effective</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agreements.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.title}</TableCell>
            <TableCell>{a.union}</TableCell>
            <TableCell>{new Date(a.effectiveDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(a.expiryDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={a.status === "Active" ? "success" : a.status === "Negotiating" ? "warning" : "secondary"}>
                {a.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>
                  Delete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
