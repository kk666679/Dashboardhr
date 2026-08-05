"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface CanvasSettingsProps {
  gridSize?: number;
  onGridSizeChange?: (size: number) => void;
  snapEnabled?: boolean;
  onSnapToggle?: (enabled: boolean) => void;
  gridEnabled?: boolean;
  onGridToggle?: (enabled: boolean) => void;
  zoomMin?: number;
  zoomMax?: number;
  onZoomLimitsChange?: (min: number, max: number) => void;
}

export function CanvasSettings({
  gridSize = 15,
  onGridSizeChange,
  snapEnabled = true,
  onSnapToggle,
  gridEnabled = true,
  onGridToggle,
  zoomMin = 0.2,
  zoomMax = 2,
  onZoomLimitsChange,
}: CanvasSettingsProps) {
  const [localGridSize, setLocalGridSize] = useState(gridSize);

  const handleGridSizeChange = (val: number) => {
    setLocalGridSize(val);
    onGridSizeChange?.(val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canvas Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-toggle">Show Grid</Label>
          <Switch id="grid-toggle" checked={gridEnabled} onCheckedChange={onGridToggle} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="snap-toggle">Snap to Grid</Label>
          <Switch id="snap-toggle" checked={snapEnabled} onCheckedChange={onSnapToggle} />
        </div>

        <div>
          <Label>Grid Size: {localGridSize}px</Label>
          <Slider
            min={5}
            max={50}
            step={1}
            value={[localGridSize]}
            onValueChange={([val]) => handleGridSizeChange(val)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Zoom Limits</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                type="number"
                min={0.1}
                max={1}
                step={0.1}
                value={zoomMin}
                onChange={(e) => onZoomLimitsChange?.(parseFloat(e.target.value), zoomMax)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                type="number"
                min={1}
                max={5}
                step={0.5}
                value={zoomMax}
                onChange={(e) => onZoomLimitsChange?.(zoomMin, parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
