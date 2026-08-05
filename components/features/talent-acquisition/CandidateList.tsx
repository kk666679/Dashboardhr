"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  stage: "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
  appliedDate: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  onDelete?: (id: string) => void;
}

export function CandidateList({ candidates, onDelete }: CandidateListProps) {
  const router = useRouter();

  const stageColors = {
    Screening: "secondary",
    Interview: "warning",
    Offer: "default",
    Hired: "success",
    Rejected: "destructive",
  } as const;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Job</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.name}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>{c.jobTitle}</TableCell>
            <TableCell>
              <Badge variant={stageColors[c.stage] || "secondary"}>
                {c.stage}
              </Badge>
            </TableCell>
            <TableCell>{new Date(c.appliedDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/talent/candidates/${c.id}`)}>
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/talent/candidates/${c.id}/edit`)}>
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
