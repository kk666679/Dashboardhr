"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  status: "Published" | "Draft" | "Archived";
  enrollments: number;
}

interface CourseListProps {
  courses: Course[];
  onDelete?: (id: string) => void;
}

export function CourseList({ courses, onDelete }: CourseListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Enrollments</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.title}</TableCell>
            <TableCell>{c.category}</TableCell>
            <TableCell>{c.duration}</TableCell>
            <TableCell>{c.enrollments}</TableCell>
            <TableCell>
              <Badge variant={c.status === "Published" ? "success" : c.status === "Draft" ? "warning" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/learning/courses/${c.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/learning/courses/${c.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
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
