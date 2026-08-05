import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debitTotal: number;
  creditTotal: number;
  status: "Draft" | "Posted" | "Reversed";
  createdBy: string;
}

interface JournalEntryListProps {
  entries: JournalEntry[];
  onDelete?: (id: string) => void;
}

export function JournalEntryList({ entries, onDelete }: JournalEntryListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
            <TableCell className="font-mono text-xs">{e.reference}</TableCell>
            <TableCell>{e.description}</TableCell>
            <TableCell>{e.debitTotal}</TableCell>
            <TableCell>{e.creditTotal}</TableCell>
            <TableCell>
              <Badge variant={e.status === "Posted" ? "success" : e.status === "Draft" ? "warning" : "secondary"}>
                {e.status}
              </Badge>
            </TableCell>
            <TableCell>{e.createdBy}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm">View</Button>
              {e.status === "Draft" && onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(e.id)}>
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
