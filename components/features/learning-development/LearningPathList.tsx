"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: number;
  status: "Active" | "Archived";
}

interface LearningPathListProps {
  paths: LearningPath[];
  onDelete?: (id: string) => void;
}

export function LearningPathList({ paths, onDelete }: LearningPathListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Courses</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paths.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.description}</TableCell>
            <TableCell>{p.courses}</TableCell>
            <TableCell>
              <Badge variant={p.status === "Active" ? "success" : "secondary"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/learning/paths/${p.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/learning/paths/${p.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)}>
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
