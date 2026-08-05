import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  status: "Active" | "Inactive";
}

interface BranchListProps {
  branches: Branch[];
  onDelete?: (id: string) => void;
}

export function BranchList({ branches, onDelete }: BranchListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {branches.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-mono text-xs">{b.code}</TableCell>
            <TableCell>{b.name}</TableCell>
            <TableCell>{b.location}</TableCell>
            <TableCell>{b.manager}</TableCell>
            <TableCell>
              <Badge variant={b.status === "Active" ? "success" : "secondary"}>
                {b.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(b.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
