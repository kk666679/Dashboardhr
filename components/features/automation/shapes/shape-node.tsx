"use client";

import { NodeProps } from "@xyflow/react";
import type { AutomationNode } from "../node/types";

export function ShapeNode({ data }: NodeProps<AutomationNode>) {
  const shape = data?.shape || "rectangle";
  const color = data?.color || "#3b82f6";
  const label = data?.label || "Shape";

  return (
    <div
      style={{
        backgroundColor: color,
        color: "white",
        padding: "8px 16px",
        borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "8px" : "0",
        width: "120px",
        height: shape === "circle" ? "120px" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "bold",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {label}
    </div>
  );
}
