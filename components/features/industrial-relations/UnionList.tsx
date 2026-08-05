import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Union {
  id: string;
  name: string;
  registration: string;
  representative: string;
  status: "Active" | "Inactive";
}

interface UnionListProps {
  unions: Union[];
  onDelete?: (id: string) => void;
}

export function UnionList({ unions, onDelete }: UnionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Registration</TableHead>
          <TableHead>Representative</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {unions.map((u) => (
          <TableRow key={u.id}>
            <TableCell>{u.name}</TableCell>
            <TableCell>{u.registration}</TableCell>
            <TableCell>{u.representative}</TableCell>
            <TableCell>
              <Badge variant={u.status === "Active" ? "success" : "secondary"}>
                {u.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(u.id)}>
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
