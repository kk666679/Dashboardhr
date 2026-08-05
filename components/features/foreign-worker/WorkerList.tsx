"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface ForeignWorker {
  id: string;
  name: string;
  passportNumber: string;
  nationality: string;
  permitType: string;
  permitExpiry: string;
  status: "Active" | "Pending" | "Expired" | "Renewal";
  employer: string;
}

interface WorkerListProps {
  workers: ForeignWorker[];
  onDelete?: (id: string) => void;
}

export function WorkerList({ workers, onDelete }: WorkerListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Passport</TableHead>
          <TableHead>Nationality</TableHead>
          <TableHead>Permit Type</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Employer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workers.map((w) => (
          <TableRow key={w.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{w.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{w.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs">{w.passportNumber}</TableCell>
            <TableCell>{w.nationality}</TableCell>
            <TableCell>{w.permitType}</TableCell>
            <TableCell>{new Date(w.permitExpiry).toLocaleDateString()}</TableCell>
            <TableCell>{w.employer}</TableCell>
            <TableCell>
              <Badge variant={w.status === "Active" ? "success" : w.status === "Expired" ? "destructive" : w.status === "Renewal" ? "warning" : "secondary"}>
                {w.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/foreign-workers/${w.id}`)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/foreign-workers/${w.id}/edit`)}>Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(w.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
