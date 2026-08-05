"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,

  Undo,
  Redo,
  Save,
  Download,
  Upload,
  Layers,
  Search,
} from "lucide-react";

interface CanvasToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onToggleLayers: () => void;
  onToggleSearch: () => void;
  showGrid?: boolean;
  showSnap?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

export function CanvasToolbar({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  onToggleSnap,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onImport,
  onToggleLayers,
  onToggleSearch,
  showGrid = true,
  showSnap = true,
  canUndo = false,
  canRedo = false,
  className,
}: CanvasToolbarProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-background border rounded-md shadow-sm ${className}`}>
      <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onFitView} title="Fit View">
        <Maximize className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Toggle pressed={showGrid} onPressedChange={onToggleGrid} aria-label="Toggle Grid">
        <Grid className="h-4 w-4" />
      </Toggle>
      <Toggle pressed={showSnap} onPressedChange={onToggleSnap} aria-label="Toggle Snap">
        <Grid className="h-4 w-4" />
      </Toggle>


      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" onClick={onSave} title="Save">
        <Save className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onExport} title="Export JSON">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onImport} title="Import JSON">
        <Upload className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" onClick={onToggleLayers} title="Layers">
        <Layers className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onToggleSearch} title="Search">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
