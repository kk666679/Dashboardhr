import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  employees: number;
  status: "Active" | "Inactive";
}

interface DepartmentListProps {
  departments: Department[];
  onDelete?: (id: string) => void;
}

export function DepartmentList({ departments, onDelete }: DepartmentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Head</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-mono text-xs">{d.code}</TableCell>
            <TableCell>{d.name}</TableCell>
            <TableCell>{d.head}</TableCell>
            <TableCell>{d.employees}</TableCell>
            <TableCell>
              <Badge variant={d.status === "Active" ? "success" : "secondary"}>
                {d.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(d.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
