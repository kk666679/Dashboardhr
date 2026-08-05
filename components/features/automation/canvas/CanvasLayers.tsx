"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  count: number;
}

interface CanvasLayersProps {
  layers: Layer[];
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onSelectLayer: (id: string) => void;
  selectedLayerId?: string;
  onAddLayer?: () => void;
}

export function CanvasLayers({
  layers,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  onSelectLayer,
  selectedLayerId,
  onAddLayer,
}: CanvasLayersProps) {
  return (
    <Card className="w-64">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Layers</CardTitle>
          {onAddLayer && (
            <Button variant="ghost" size="sm" onClick={onAddLayer}>+</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-1">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`
              flex items-center gap-1 p-1 rounded cursor-pointer
              ${selectedLayerId === layer.id ? "bg-muted" : "hover:bg-muted/50"}
            `}
            onClick={() => onSelectLayer(layer.id)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
            >
              {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <span className="text-sm flex-1 truncate">{layer.name}</span>
            <Badge variant="secondary" className="text-xs">{layer.count}</Badge>
            {layer.locked && <span className="text-xs text-muted-foreground">🔒</span>}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
