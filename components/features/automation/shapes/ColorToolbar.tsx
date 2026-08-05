"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// Using native input color picker instead of react-colorful

interface ColorToolbarProps {
  onColorChange: (color: string) => void;
  defaultColor?: string;
}

const presetColors = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#64748b",
];

export function ColorToolbar({ onColorChange, defaultColor = "#3b82f6" }: ColorToolbarProps) {
  const [color, setColor] = useState(defaultColor);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-background border rounded-md">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 p-0 rounded-full"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} className="w-full h-32 cursor-pointer" />
          <div className="flex flex-wrap gap-1 mt-2">
            {presetColors.map((c) => (
              <Button
                key={c}
                variant="outline"
                className="w-6 h-6 p-0 rounded-full"
                style={{ backgroundColor: c }}
                onClick={() => handleColorChange(c)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex gap-1">
        {presetColors.map((c) => (
          <Button
            key={c}
            variant="outline"
            className="w-6 h-6 p-0 rounded-full"
            style={{ backgroundColor: c }}
            onClick={() => handleColorChange(c)}
          />
        ))}
      </div>
    </div>
  );
}
