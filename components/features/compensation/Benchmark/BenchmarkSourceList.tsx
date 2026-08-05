import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SalaryBenchmarkSource {
  id: string;
  name: string;
  sourceType: string;
  [key: string]: unknown;
}

interface BenchmarkSourceListProps {
  sources: SalaryBenchmarkSource[];
  onDelete?: (id: string) => void;
}

export function BenchmarkSourceList({ sources, onDelete }: BenchmarkSourceListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Source Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.name}</TableCell>
            <TableCell>{s.sourceType}</TableCell>
            <TableCell className="text-right">
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(s.id)}>
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
