"use client";

import { Button } from "@/components/ui/button";

interface ShapeItem {
  type: string;
  label: string;
  shape: string;
  color: string;
}

const shapes: ShapeItem[] = [
  { type: "shape", label: "Rectangle", shape: "rectangle", color: "#3b82f6" },
  { type: "shape", label: "Circle", shape: "circle", color: "#22c55e" },
  { type: "shape", label: "Rounded", shape: "rounded", color: "#8b5cf6" },
  { type: "shape", label: "Triangle", shape: "triangle", color: "#eab308" },
  { type: "shape", label: "Diamond", shape: "diamond", color: "#ef4444" },
];

interface ShapePaletteProps {
  onDragStart?: (item: ShapeItem) => void;
}

export function ShapePalette({ onDragStart }: ShapePaletteProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-background border rounded-md">
      {shapes.map((shape) => (
        <div
          key={shape.label}
          draggable
          onDragStart={() => {
            onDragStart?.(shape);
          }}
          className="cursor-grab"
        >
          <div
            style={{
              backgroundColor: shape.color,
              width: "60px",
              height: "60px",
              borderRadius: shape.shape === "circle" ? "50%" : shape.shape === "rounded" ? "8px" : "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "10px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {shape.label}
          </div>
        </div>
      ))}
    </div>
  );
}
