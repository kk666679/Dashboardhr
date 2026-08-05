"use client";

import { DragOverlay as DndDragOverlay } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DragOverlayProps {
  children?: React.ReactNode;
  className?: string;
}

export function DragOverlay({ children, className }: DragOverlayProps) {
  return (
    <DndDragOverlay>
      <div
        className={cn(
          "p-2 bg-background border-2 border-primary rounded-md shadow-lg",
          className
        )}
      >
        {children}
      </div>
    </DndDragOverlay>
  );
}
