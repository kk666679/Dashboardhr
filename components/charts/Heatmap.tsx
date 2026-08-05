import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChartContainer } from './ChartContainer';

interface HeatmapDataPoint {
  [key: string]: any;
}

interface HeatmapProps {
  data: HeatmapDataPoint[];
  xKey: string; // key for x-axis categories
  yKey: string; // key for y-axis categories
  valueKey: string; // key for the value to color
  colors?: string[]; // array of colors for gradient (low to high)
  className?: string;
  aspectRatio?: number;
}

const defaultColors = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'];

export function Heatmap({
  data,
  xKey,
  yKey,
  valueKey,
  colors = defaultColors,
  className,
  aspectRatio = 1.5,
}: HeatmapProps) {
  // Extract unique x and y values
  const xValues = Array.from(new Set(data.map(d => d[xKey]))).sort();
  const yValues = Array.from(new Set(data.map(d => d[yKey]))).sort();

  // Find min and max values for color scaling
  const values = data.map(d => Number(d[valueKey]));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const getColor = (value: number) => {
    const normalized = (value - minVal) / range;
    const index = Math.min(Math.floor(normalized * (colors.length - 1)), colors.length - 1);
    return colors[index];
  };

  // Build lookup map
  const valueMap: Record<string, Record<string, number>> = {};
  data.forEach(d => {
    const xVal = String(d[xKey]);
    const yVal = String(d[yKey]);
    if (!valueMap[xVal]) valueMap[xVal] = {};
    valueMap[xVal][yVal] = Number(d[valueKey]);
  });

  const [tooltip, setTooltip] = useState<{ x: string; y: string; value: number; xPos: number; yPos: number } | null>(null);

  return (
    <ChartContainer className={cn(className)} aspectRatio={aspectRatio}>
      <div className="relative w-full h-full">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `auto repeat(${xValues.length}, 1fr)`,
            gridTemplateRows: `auto repeat(${yValues.length}, 1fr)`,
            gap: '2px',
            width: '100%',
            height: '100%',
          }}
        >
          {/* top-left corner */}
          <div className="flex items-center justify-center text-xs font-semibold text-muted-foreground" />
          {/* x-axis labels */}
          {xValues.map(x => (
            <div key={x} className="flex items-center justify-center text-xs font-medium text-muted-foreground p-1">
              {x}
            </div>
          ))}
          {/* rows */}
          {yValues.map(y => (
            <React.Fragment key={y}>
              <div className="flex items-center justify-center text-xs font-medium text-muted-foreground p-1">
                {y}
              </div>
              {xValues.map(x => {
                const value = valueMap[x]?.[y];
                const isDefined = value !== undefined && value !== null;
                const color = isDefined ? getColor(value) : '#e5e7eb';
                return (
                  <div
                    key={`${x}-${y}`}
                    className="relative cursor-pointer transition-colors duration-150"
                    style={{ backgroundColor: color, aspectRatio: '1' }}
                    onMouseEnter={(e) => {
                      if (isDefined) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: String(x),
                          y: String(y),
                          value: value,
                          xPos: rect.left + rect.width / 2,
                          yPos: rect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {isDefined && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
                        {value}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {/* tooltip */}
        {tooltip && (
          <div
            className="fixed pointer-events-none bg-black text-white px-2 py-1 rounded text-xs shadow-lg"
            style={{
              left: tooltip.xPos,
              top: tooltip.yPos - 30,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {tooltip.x}, {tooltip.y}: {tooltip.value}
          </div>
        )}
      </div>
    </ChartContainer>
  );
}
