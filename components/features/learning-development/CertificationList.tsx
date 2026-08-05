import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Certification {
  id: string;
  employee: string;
  course: string;
  issuedDate: string;
  expiryDate: string | null;
  status: "Active" | "Expired" | "Revoked";
}

interface CertificationListProps {
  certifications: Certification[];
  onRevoke?: (id: string) => void;
}

export function CertificationList({ certifications, onRevoke }: CertificationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Issued</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {certifications.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.employee}</TableCell>
            <TableCell>{c.course}</TableCell>
            <TableCell>{new Date(c.issuedDate).toLocaleDateString()}</TableCell>
            <TableCell>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "Never"}</TableCell>
            <TableCell>
              <Badge variant={c.status === "Active" ? "success" : c.status === "Expired" ? "warning" : "destructive"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {c.status === "Active" && onRevoke && (
                <Button variant="destructive" size="sm" onClick={() => onRevoke(c.id)}>
                  Revoke
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
