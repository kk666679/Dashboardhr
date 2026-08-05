"use client";

export const onDragStart = (event: React.DragEvent, nodeType: string, nodeData?: any) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.setData("application/reactflow-data", JSON.stringify(nodeData || {}));
  event.dataTransfer.effectAllowed = "move";
};

export const onDragOver = (event: React.DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

export const onDrop = (event: React.DragEvent, onDropCallback: (type: string, data: unknown, position: { x: number; y: number }) => void) => {
  event.preventDefault();
  const type = event.dataTransfer.getData("application/reactflow");
  const data = JSON.parse(event.dataTransfer.getData("application/reactflow-data") || "{}");
  const position = {
    x: event.clientX - 100,
    y: event.clientY - 40,
  };
  onDropCallback(type, data, position);
};

export const getDragItem = (type: string, label: string, icon?: React.ReactNode) => ({
  type,
  label,
  icon,
});
