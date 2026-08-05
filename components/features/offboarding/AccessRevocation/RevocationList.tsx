"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";

interface RevocationData {
  id: string;
  system: string;
  role?: string | null;
  status: string;
  requestedAt: string | Date;
  [key: string]: unknown;
}

interface RevocationListProps {
  revocations: RevocationData[];
  terminationId: string;
  onUpdate?: () => void;
}

export function RevocationList({ revocations, terminationId, onUpdate }: RevocationListProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { mutate: complete, isPending } = (trpc as any).revocation.complete.useMutation({
    onSuccess: () => {
      toast({ title: "Revocation completed" });
      (utils as any).revocation.getByTermination.invalidate({ terminationId });
      onUpdate?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>System</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {revocations.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.system}</TableCell>
            <TableCell>{r.role || "-"}</TableCell>
            <TableCell>
              <Badge variant={r.status === "COMPLETED" ? "success" as "default" : "warning" as "default"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(r.requestedAt).toLocaleDateString()}</TableCell>
            <TableCell>
              {r.status !== "COMPLETED" && (
                <Button size="sm" onClick={() => complete({ id: r.id })} disabled={isPending}>
                  Complete
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

