"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SortableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none cursor-grab active:cursor-grabbing",
        isDragging && "ring-2 ring-primary ring-offset-2 z-50",
        className
      )}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
