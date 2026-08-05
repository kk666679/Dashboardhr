"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableShapeProps {
  id: string;
  shape: "rectangle" | "circle" | "rounded" | "triangle" | "diamond";
  color: string;
  label?: string;
  size?: number;
  className?: string;
  disabled?: boolean;
  data?: any;
}

export function DraggableShape({
  id,
  shape,
  color,
  label,
  size = 60,
  className,
  disabled = false,
  data,
}: DraggableShapeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type: "shape", shape, color, label, nodeData: data },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? "default" : "grab",
    width: size,
    height: shape === "circle" ? size : size * 0.8,
    backgroundColor: color,
    borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "8px" : "0",
    clipPath: shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : shape === "diamond" ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
    boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("transition-shadow", className)}
    >
      {label || shape}
    </div>
  );
}
