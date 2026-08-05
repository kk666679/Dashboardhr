"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SwapApprovalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment?: string) => void;
  isPending?: boolean;
}

export function SwapApproval({ open, onOpenChange, onConfirm, isPending }: SwapApprovalProps) {
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Swap Request</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium">Comment (optional)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onConfirm(comment)} disabled={isPending}>
            {isPending ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
