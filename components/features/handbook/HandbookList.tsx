'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Handbook {
  id: string;
  title: string;
  version: string;
  updated: string;
  status: "Published" | "Draft" | "Archived";
}

interface HandbookListProps {
  handbooks: Handbook[];
  onDelete?: (id: string) => void;
}

export function HandbookList({ handbooks, onDelete }: HandbookListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {handbooks.map((h) => (
          <TableRow key={h.id}>
            <TableCell>{h.title}</TableCell>
            <TableCell>{h.version}</TableCell>
            <TableCell>{new Date(h.updated).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={h.status === "Published" ? "success" : h.status === "Draft" ? "warning" : "secondary"}>
                {h.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/handbook/${h.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/handbook/${h.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(h.id)}>
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
