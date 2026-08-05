"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DraggableProps {
  id: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  data?: any;
}

export function Draggable({ id, children, className, disabled = false, data }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none cursor-grab active:cursor-grabbing",
        isDragging && "ring-2 ring-primary ring-offset-2",
        className
      )}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
