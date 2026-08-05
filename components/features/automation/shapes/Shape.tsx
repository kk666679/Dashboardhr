"use client";

// Basic shape component for reuse
export function Shape({ type, color, size = 50 }: { type: string; color: string; size?: number }) {
  const style = {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: type === "circle" ? "50%" : type === "rounded" ? "8px" : "0",
    display: "inline-block",
  };

  return <div style={style} />;
}
