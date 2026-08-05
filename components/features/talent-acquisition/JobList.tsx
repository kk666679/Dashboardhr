"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  status: "Open" | "Closed" | "On Hold";
  applicants: number;
}

interface JobListProps {
  jobs: Job[];
  onDelete?: (id: string) => void;
}

export function JobList({ jobs, onDelete }: JobListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Applicants</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((j) => (
          <TableRow key={j.id}>
            <TableCell>{j.title}</TableCell>
            <TableCell>{j.department}</TableCell>
            <TableCell>{j.location}</TableCell>
            <TableCell>
              <Badge variant="secondary">{j.type}</Badge>
            </TableCell>
            <TableCell>{j.applicants}</TableCell>
            <TableCell>
              <Badge variant={j.status === "Open" ? "success" : j.status === "On Hold" ? "warning" : "secondary"}>
                {j.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/talent/jobs/${j.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/talent/jobs/${j.id}/edit`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(j.id)}>
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
