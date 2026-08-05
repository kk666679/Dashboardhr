import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Permit {
  id: string;
  employee: string;
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Pending" | "Revoked";
}

interface PermitListProps {
  permits: Permit[];
  onDelete?: (id: string) => void;
}

export function PermitList({ permits, onDelete }: PermitListProps) {
  const router = useRouter();

  const isExpiringSoon = (expiryDate: string) => {
    const days = (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return days <= 30 && days > 0;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permits.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.employee}</TableCell>
            <TableCell>{p.type}</TableCell>
            <TableCell>{p.number}</TableCell>
            <TableCell>{new Date(p.issueDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <span className={isExpiringSoon(p.expiryDate) ? "text-yellow-600 font-medium" : ""}>
                {new Date(p.expiryDate).toLocaleDateString()}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={p.status === "Active" ? "success" : p.status === "Pending" ? "warning" : p.status === "Revoked" ? "destructive" : "secondary"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/permits/${p.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/permits/${p.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>
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
