"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
}

interface TeamListProps {
  members: TeamMember[];
}

export function TeamList({ members }: TeamListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell>{m.name}</TableCell>
            <TableCell>{m.email}</TableCell>
            <TableCell>{m.role}</TableCell>
            <TableCell>
              <Badge variant={m.status === "Active" ? "success" : m.status === "On Leave" ? "warning" : "secondary"}>
                {m.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(m.joinDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => router.push(`/mss/team/${m.id}`)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
