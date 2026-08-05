"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DroppableCanvasProps {
  id: string;
  children: ReactNode;
  className?: string;
  isOver?: boolean;
}

export function DroppableCanvas({ id, children, className, isOver }: DroppableCanvasProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative w-full h-full",
        (isOver || isDroppableOver) && "ring-2 ring-primary ring-inset",
        className
      )}
    >
      {children}
      {(isOver || isDroppableOver) && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none flex items-center justify-center">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm text-sm font-medium text-muted-foreground">
            Drop here
          </span>
        </div>
      )}
    </div>
  );
}
