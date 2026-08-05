import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";

interface RadarChartProps {
  data: unknown[];
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  className?: string;
  aspectRatio?: number;
  showLegend?: boolean;
}

const defaultColors = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

export function RadarChart({
  data,
  xKey,
  yKey,
  colors = defaultColors,
  className,
  aspectRatio = 1.5,
  showLegend = true,
}: RadarChartProps) {
  const keys = Array.isArray(yKey) ? yKey : [yKey];
  return (
    <ChartContainer className={cn(className)} aspectRatio={aspectRatio}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={xKey} />
          <PolarRadiusAxis />
          <Tooltip />
          {showLegend && <Legend />}
          {keys.map((key, i) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.3}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
