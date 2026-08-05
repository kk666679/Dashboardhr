"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DroppableProps {
  id: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  data?: any;
  highlight?: boolean;
}

export function Droppable({ id, children, className, disabled = false, data, highlight }: DroppableProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-colors duration-200",
        isOver && highlight && "ring-2 ring-primary ring-offset-2 bg-primary/5",
        className
      )}
    >
      {children}
    </div>
  );
}
