"use client";

import { useState } from "react";
import { Draggable } from "../dnd/Draggable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NodePaletteItem as PaletteItem } from "./paletteData";

interface NodePaletteItemProps {
  item: PaletteItem;
  onAdd: (item: PaletteItem) => void;
}

export function NodePaletteItem({ item, onAdd }: NodePaletteItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onAdd(item);
  };

  return (
    <Draggable
      id={`palette-${item.id}`}
      data={{
        type: "node",
        nodeType: item.type,
        data: {
          label: item.label,
          description: item.description,
          ...item.defaultData,
        },
      }}
    >
      <div
        className={cn(
          "relative flex items-center gap-2 p-2 rounded-lg border transition-all cursor-grab active:cursor-grabbing",
          isHovered ? "border-primary bg-primary/5 shadow-sm" : "border-transparent hover:border-border"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-lg">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{item.label}</div>
          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
        </div>
        {item.favorite && (
          <Badge variant="outline" className="text-xs h-4 px-1">⭐</Badge>
        )}
        {item.badge && (
          <Badge variant="secondary" className="text-xs h-4 px-1">{item.badge}</Badge>
        )}
      </div>
    </Draggable>
  );
}
