import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewApprovalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (comment?: string) => void;
  onReject: (comment?: string) => void;
  isPending?: boolean;
}

export function ReviewApproval({ open, onOpenChange, onApprove, onReject, isPending }: ReviewApprovalProps) {
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Salary Review</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium">Comment</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
        </div>
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => onReject(comment)} disabled={isPending}>
            Reject
          </Button>
          <Button onClick={() => onApprove(comment)} disabled={isPending}>
            {isPending ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
