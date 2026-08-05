import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Insurance {
  id: string;
  worker: string;
  provider: string;
  policyNumber: string;
  coverageStart: string;
  coverageEnd: string;
  status: "Active" | "Expired" | "Renewal";
}

interface InsuranceListProps {
  policies: Insurance[];
  onDelete?: (id: string) => void;
}

export function InsuranceList({ policies, onDelete }: InsuranceListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Policy #</TableHead>
          <TableHead>Coverage Start</TableHead>
          <TableHead>Coverage End</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.worker}</TableCell>
            <TableCell>{p.provider}</TableCell>
            <TableCell className="font-mono text-xs">{p.policyNumber}</TableCell>
            <TableCell>{new Date(p.coverageStart).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(p.coverageEnd).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Active" ? "success" : p.status === "Expired" ? "destructive" : "warning"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
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
