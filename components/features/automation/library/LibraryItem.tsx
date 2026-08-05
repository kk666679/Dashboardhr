"use client";

import { useState } from "react";
import { Draggable } from "../dnd/Draggable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LibraryItem as LibraryItemType } from "./libraryData";
import { Eye, Plus } from "lucide-react";

interface LibraryItemProps {
  item: LibraryItemType;
  onSelect: (item: LibraryItemType) => void;
}

export function LibraryItem({ item, onSelect }: LibraryItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onSelect(item);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item);
  };

  return (
    <Draggable
      id={`library-${item.id}`}
      data={{
        type: "library",
        item: item,
      }}
    >
      <div
        className={cn(
          "relative flex items-start gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing",
          isHovered ? "border-primary bg-primary/5 shadow-sm" : "border-transparent hover:border-border"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-2xl bg-muted/20">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium truncate">{item.name}</span>
            <Badge variant="outline" className="text-xs shrink-0">
              {item.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">
                {tag}
              </Badge>
            ))}
            <span className="text-[10px] text-muted-foreground">
              {item.usageCount || 0} uses
            </span>
          </div>
        </div>
        {isHovered && (
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleAdd}
              title="Add to canvas"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClick}
              title="View details"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </Draggable>
  );
}
