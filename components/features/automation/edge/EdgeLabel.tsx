"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Edit2 } from "lucide-react";

interface EdgeLabelProps {
  label: string;
  onLabelChange?: (newLabel: string) => void;
  onDelete?: () => void;
  isHovered?: boolean;
  status?: "pending" | "running" | "completed" | "failed";
  editable?: boolean;
  className?: string;
}

export function EdgeLabel({
  label,
  onLabelChange,
  onDelete,
  isHovered = false,
  status,
  editable = false,
  className = "",
}: EdgeLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() && value !== label) {
      onLabelChange?.(value.trim());
    } else {
      setValue(label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setValue(label);
    }
  };

  const statusColors = {
    pending: "bg-gray-100 border-gray-300",
    running: "bg-blue-50 border-blue-300",
    completed: "bg-green-50 border-green-300",
    failed: "bg-red-50 border-red-300",
  };

  const statusDotColors = {
    pending: "bg-gray-400",
    running: "bg-blue-500 animate-pulse",
    completed: "bg-green-500",
    failed: "bg-red-500",
  };

  const statusDot = status && (
    <span className={`h-2 w-2 rounded-full ${statusDotColors[status]}`} />
  );

  return (
    <div
      className={`flex items-center gap-1 bg-background border rounded-full px-2 py-0.5 text-xs shadow-sm transition-all ${
        isHovered ? "scale-105 shadow-md" : ""
      } ${status ? statusColors[status] : ""} ${className}`}
      onDoubleClick={() => editable && setIsEditing(true)}
    >
      {statusDot}
      {isEditing ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-5 min-w-[60px] px-1 text-xs border-0 shadow-none focus-visible:ring-0"
        />
      ) : (
        <span className="truncate max-w-[100px]">{label}</span>
      )}
      {editable && !isEditing && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3 w-3 text-muted-foreground" />
        </Button>
      )}
      {onDelete && isHovered && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={onDelete}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}