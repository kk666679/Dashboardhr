import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { getLocaleFromPath, setLocaleInPath } from "@/lib/locale-utils";

interface Document {
  id: string;
  title: string;
  type: string;
  template: string;
  status: "Draft" | "Pending" | "Signed" | "Archived";
  createdAt: string;
  createdBy: string;
  version: number;
}

interface DocumentLibraryProps {
  documents: Document[];
  onDelete?: (id: string) => void;
}

export function DocumentLibrary({ documents, onDelete }: DocumentLibraryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const filtered = documents.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => router.push(setLocaleInPath("/dashboard/documents", getLocaleFromPath(pathname)))}>Generate New</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.title}</TableCell>
              <TableCell>{d.type}</TableCell>
              <TableCell>{d.template}</TableCell>
              <TableCell>v{d.version}</TableCell>
              <TableCell>{new Date(d.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={d.status === "Signed" ? "success" : d.status === "Pending" ? "warning" : d.status === "Archived" ? "secondary" : "outline"}>
                  {d.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/documents/${d.id}`)}>View</Button>
                <Button variant="outline" size="sm" onClick={() => router.push(`/documents/${d.id}/edit`)}>Edit</Button>
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(d.id)}>Delete</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
