"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useFlowOperations } from "../../../../hooks/useFlowOperations";
import { useToast } from "@/components/ui/use-toast";

interface GridLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GridLayout({ open, onOpenChange }: GridLayoutProps) {
  const { toast } = useToast();
  const { nodes, updateNode, pushCurrentState } = useFlowOperations();
  const [columns, setColumns] = useState(3);
  const [spacing, setSpacing] = useState(80);
  const [isApplying, setIsApplying] = useState(false);

  const applyGridLayout = useCallback(() => {
    if (nodes.length === 0) {
      toast({ title: "No nodes to arrange" });
      return;
    }

    setIsApplying(true);
    try {
      const rows = Math.ceil(nodes.length / columns);
      const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id)); // deterministic
      const startX = 100;
      const startY = 100;

      sorted.forEach((node, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = startX + col * (spacing + (node.width || 172));
        const y = startY + row * (spacing + (node.height || 72));
        updateNode(node.id, { position: { x, y } });
      });

      pushCurrentState();
      toast({ title: "Grid layout applied" });
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Layout failed", description: String(error), variant: "destructive" });
    } finally {
      setIsApplying(false);
    }
  }, [nodes, columns, spacing, updateNode, pushCurrentState, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grid Layout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              type="number"
              min={1}
              max={10}
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <Label htmlFor="spacing">Spacing (px)</Label>
            <Input
              id="spacing"
              type="number"
              min={10}
              max={200}
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value) || 50)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={applyGridLayout} disabled={isApplying}>
            {isApplying ? "Applying..." : "Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
