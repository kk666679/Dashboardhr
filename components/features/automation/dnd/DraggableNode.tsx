"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableNodeProps {
  id: string;
  type: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  disabled?: boolean;
  data?: any;
}

export function DraggableNode({
  id,
  type,
  label,
  icon,
  color,
  className,
  disabled = false,
  data,
}: DraggableNodeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, label, nodeData: data, color },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? "default" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 p-2 border rounded-md bg-background hover:bg-muted/50 transition-colors",
        isDragging && "ring-2 ring-primary",
        className
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="text-sm">{label}</span>
      {color && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
    </div>
  );
}
