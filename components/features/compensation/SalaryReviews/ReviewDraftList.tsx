import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SalaryReviewDraft {
  id: string;
  employeeId: string;
  currentSalary: number;
  proposedSalary: number;
  status: string;
  [key: string]: unknown;
}

interface ReviewDraftListProps {
  drafts: SalaryReviewDraft[];
  onSubmit?: (id: string) => void;
}

export function ReviewDraftList({ drafts, onSubmit }: ReviewDraftListProps) {
  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "APPROVED") return "default";
    if (status === "REVIEW") return "secondary";
    return "secondary";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Current Salary</TableHead>
          <TableHead>Proposed Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drafts.map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.employeeId}</TableCell>
            <TableCell>${d.currentSalary}</TableCell>
            <TableCell>${d.proposedSalary}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(d.status)}>{d.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {d.status === "DRAFT" && onSubmit && (
                <Button size="sm" onClick={() => onSubmit(d.id)}>
                  Submit for Review
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
