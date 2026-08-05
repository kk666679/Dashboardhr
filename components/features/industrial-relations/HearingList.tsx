import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Hearing {
  id: string;
  caseId: string;
  date: string;
  time: string;
  location: string;
  status: "Scheduled" | "Held" | "Cancelled" | "Postponed";
  attendees: string[];
}

interface HearingListProps {
  hearings: Hearing[];
  onDelete?: (id: string) => void;
}

export function HearingList({ hearings, onDelete }: HearingListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Attendees</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hearings.map((h) => (
          <TableRow key={h.id}>
            <TableCell>{h.caseId}</TableCell>
            <TableCell>{new Date(h.date).toLocaleDateString()}</TableCell>
            <TableCell>{h.time}</TableCell>
            <TableCell>{h.location}</TableCell>
            <TableCell>
              <Badge variant={h.status === "Held" ? "success" : h.status === "Scheduled" ? "warning" : "secondary"}>
                {h.status}
              </Badge>
            </TableCell>
            <TableCell>{h.attendees.join(", ")}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(h.id)}>
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
