import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Revocation {
  id: string;
  system: string;
  role: string;
  status: "Pending" | "In Progress" | "Completed" | "Failed";
  requestedAt: string;
  completedAt: string | null;
}

interface AccessRevocationProps {
  revocations: Revocation[];
  onComplete?: (id: string) => void;
}

export function AccessRevocation({ revocations, onComplete }: AccessRevocationProps) {
  const allCompleted = revocations.every(r => r.status === "Completed");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Access Revocation</h3>
        {allCompleted ? (
          <Badge variant="success">All Access Revoked</Badge>
        ) : (
          <Badge variant="warning">{revocations.filter(r => r.status !== "Completed").length} Pending</Badge>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>System</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revocations.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.system}</TableCell>
              <TableCell>{r.role || "-"}</TableCell>
              <TableCell>{new Date(r.requestedAt).toLocaleDateString()}</TableCell>
              <TableCell>{r.completedAt ? new Date(r.completedAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                <Badge variant={r.status === "Completed" ? "success" : r.status === "Failed" ? "destructive" : "warning"}>
                  {r.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {r.status !== "Completed" && (
                  <Button size="sm" onClick={() => onComplete?.(r.id)}>Complete</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
