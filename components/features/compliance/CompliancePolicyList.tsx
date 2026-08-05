import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Policy {
  id: string;
  name: string;
  category: string;
  version: string;
  effectiveDate: string;
  status: "Active" | "Review" | "Archived";
  owner: string;
}

interface CompliancePolicyListProps {
  policies: Policy[];
  onDelete?: (id: string) => void;
}

export function CompliancePolicyList({ policies, onDelete }: CompliancePolicyListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Effective</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>v{p.version}</TableCell>
            <TableCell>{new Date(p.effectiveDate).toLocaleDateString()}</TableCell>
            <TableCell>{p.owner}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Active" ? "success" : p.status === "Review" ? "warning" : "secondary"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm">Edit</Button>
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
