import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Version {
  id: string;
  version: number;
  updated: string;
  author: string;
  comment: string;
  size: string;
}

interface DocumentVersionHistoryProps {
  versions: Version[];
  onRestore?: (id: string) => void;
}

export function DocumentVersionHistory({ versions, onRestore }: DocumentVersionHistoryProps) {
  const sorted = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Version History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((v) => (
            <TableRow key={v.id}>
              <TableCell>
                <Badge variant="secondary">v{v.version}</Badge>
                {v.version === sorted[0]?.version && (
                  <Badge variant="success" className="ml-2">Latest</Badge>
                )}
              </TableCell>
              <TableCell>{new Date(v.updated).toLocaleString()}</TableCell>
              <TableCell>{v.author}</TableCell>
              <TableCell>{v.comment}</TableCell>
              <TableCell>{v.size}</TableCell>
              <TableCell className="text-right">
                {v.version !== sorted[0]?.version && onRestore && (
                  <Button size="sm" variant="outline" onClick={() => onRestore(v.id)}>Restore</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
