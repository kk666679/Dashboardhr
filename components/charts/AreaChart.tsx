import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";

interface AreaChartProps {
  data: unknown[];
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  stacked?: boolean;
  className?: string;
  aspectRatio?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

const defaultColors = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

export function AreaChart({
  data,
  xKey,
  yKey,
  colors = defaultColors,
  stacked = false,
  className,
  aspectRatio = 2,
  showGrid = true,
  showLegend = true,
}: AreaChartProps) {
  const keys = Array.isArray(yKey) ? yKey : [yKey];
  return (
    <ChartContainer className={cn(className)} aspectRatio={aspectRatio}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          {keys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId={stacked ? "a" : undefined}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.3}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
