'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Assessment {
  id: string;
  title: string;
  course: string;
  type: "Quiz" | "Exam" | "Assignment";
  questions: number;
  status: "Active" | "Draft" | "Archived";
}

interface AssessmentListProps {
  assessments: Assessment[];
  onDelete?: (id: string) => void;
}

export function AssessmentList({ assessments, onDelete }: AssessmentListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assessments.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.title}</TableCell>
            <TableCell>{a.course}</TableCell>
            <TableCell>
              <Badge variant="secondary">{a.type}</Badge>
            </TableCell>
            <TableCell>{a.questions}</TableCell>
            <TableCell>
              <Badge variant={a.status === "Active" ? "success" : a.status === "Draft" ? "warning" : "secondary"}>
                {a.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/learning/assessments/${a.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/learning/assessments/${a.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>
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
