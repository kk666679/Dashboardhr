"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";

interface SwapData {
  id: string;
  requester?: { name: string } | null;
  requesterId: string;
  targetEmployee?: { name: string } | null;
  targetEmployeeId: string;
  status: string;
  [key: string]: unknown;
}

interface SwapRequestListProps {
  requests: SwapData[];
  onUpdate?: () => void;
}

export function SwapRequestList({ requests, onUpdate }: SwapRequestListProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const api = trpc as any;
  const { mutate: approve, isPending: approving } = api.swap.approve.useMutation({
    onSuccess: () => {
      toast({ title: "Swap approved" });
      utils.swap.getAll.invalidate();
      onUpdate?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const { mutate: reject, isPending: rejecting } = api.swap.reject.useMutation({
    onSuccess: () => {
      toast({ title: "Swap rejected" });
      utils.swap.getAll.invalidate();
      onUpdate?.();
    },
    onError: (err: { message: string }) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requester</TableHead>
          <TableHead>Target Employee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.requester?.name || r.requesterId}</TableCell>
            <TableCell>{r.targetEmployee?.name || r.targetEmployeeId}</TableCell>
            <TableCell>
              <Badge variant={r.status === "APPROVED" ? "success" as "default" : r.status === "REJECTED" ? "destructive" : "warning" as "default"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell>
              {r.status === "PENDING" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => approve({ id: r.id } as any)}
                    disabled={approving}
                    className="mr-2"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => reject({ id: r.id } as any)}
                    disabled={rejecting}
                  >
                    Reject
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

