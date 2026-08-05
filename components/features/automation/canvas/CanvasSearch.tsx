"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Search as SearchIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasSearchNode {
  id: string;
  data?: {
    label?: string;
    description?: string;
  };
}

interface CanvasSearchProps {
  nodes: CanvasSearchNode[];
  onSelectNode: (nodeId: string) => void;
  onHighlightNode: (nodeId: string | null) => void;
  onClose: () => void;
}

export function CanvasSearch({ nodes, onSelectNode, onHighlightNode, onClose }: CanvasSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CanvasSearchNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = nodes.filter((n) =>
        n.data?.label?.toLowerCase().includes(query.toLowerCase()) ||
        n.data?.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(filtered.length > 0 ? 0 : -1);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query, nodes]);

  useEffect(() => {
    if (selectedIndex >= 0 && results[selectedIndex]) {
      onHighlightNode(results[selectedIndex].id);
    } else {
      onHighlightNode(null);
    }
  }, [selectedIndex, results, onHighlightNode]);

  const handleSelect = (nodeId: string) => {
    onSelectNode(nodeId);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex].id);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <Card className="absolute top-2 left-1/2 -translate-x-1/2 w-96 z-10 shadow-lg">
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search nodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-0 shadow-none focus-visible:ring-0"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {results.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto">
            {results.map((node, idx) => (
              <div
                key={node.id}
                className={cn(
                  "px-2 py-1 rounded cursor-pointer text-sm hover:bg-muted",
                  idx === selectedIndex && "bg-muted"
                )}
                onClick={() => handleSelect(node.id)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                {node.data?.label || node.id}
                {node.data?.description && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {node.data.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
