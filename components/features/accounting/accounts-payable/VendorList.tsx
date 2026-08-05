import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Vendor {
  id: string;
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  balance: number;
  status: "Active" | "Inactive";
}

interface VendorListProps {
  vendors: Vendor[];
  onDelete?: (id: string) => void;
}

export function VendorList({ vendors, onDelete }: VendorListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-mono text-xs">{v.code}</TableCell>
            <TableCell>{v.name}</TableCell>
            <TableCell>{v.contact}</TableCell>
            <TableCell>{v.email}</TableCell>
            <TableCell>{v.balance}</TableCell>
            <TableCell>
              <Badge variant={v.status === "Active" ? "success" : "secondary"}>
                {v.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(v.id)}>
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
