import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Regulation {
  id: string;
  name: string;
  jurisdiction: string;
  effectiveDate: string;
  status: "Active" | "Inactive" | "Pending";
  owner: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

interface RegulatoryRegisterProps {
  regulations: Regulation[];
  onDelete?: (id: string) => void;
}

export function RegulatoryRegister({ regulations, onDelete }: RegulatoryRegisterProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Jurisdiction</TableHead>
          <TableHead>Effective</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regulations.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.jurisdiction}</TableCell>
            <TableCell>{new Date(r.effectiveDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={r.riskLevel === "Critical" ? "destructive" : r.riskLevel === "High" ? "warning" : "secondary"}>
                {r.riskLevel}
              </Badge>
            </TableCell>
            <TableCell>{r.owner}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Active" ? "success" : r.status === "Pending" ? "warning" : "secondary"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/compliance/regulations/${r.id}`)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/compliance/regulations/${r.id}/edit`)}>Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
