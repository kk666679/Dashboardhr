import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  reason?: string;
}

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  onCancel?: (id: string) => void;
}

export function LeaveRequestList({ requests, onCancel }: LeaveRequestListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.type}</TableCell>
            <TableCell>{new Date(r.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(r.endDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Approved" ? "success" : r.status === "Pending" ? "warning" : "destructive"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell>{r.reason || "-"}</TableCell>
            <TableCell className="text-right">
              {r.status === "Pending" && onCancel && (
                <Button variant="destructive" size="sm" onClick={() => onCancel(r.id)}>
                  Cancel
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
