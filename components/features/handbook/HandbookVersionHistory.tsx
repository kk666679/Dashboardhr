import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Version {
  id: string;
  version: string;
  updated: string;
  author: string;
  comment?: string;
}

interface HandbookVersionHistoryProps {
  versions: Version[];
  onRestore?: (versionId: string) => void;
}

export function HandbookVersionHistory({ versions, onRestore }: HandbookVersionHistoryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Version</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {versions.map((v) => (
          <TableRow key={v.id}>
            <TableCell>
              <Badge variant="secondary">v{v.version}</Badge>
            </TableCell>
            <TableCell>{new Date(v.updated).toLocaleDateString()}</TableCell>
            <TableCell>{v.author}</TableCell>
            <TableCell>{v.comment || "-"}</TableCell>
            <TableCell className="text-right">
              {onRestore && (
                <Button variant="outline" size="sm" onClick={() => onRestore(v.id)}>
                  Restore
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
