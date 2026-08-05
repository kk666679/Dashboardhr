import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";

interface LineChartProps {
  data: unknown[];
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  className?: string;
  aspectRatio?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

const defaultColors = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

export function LineChart({
  data,
  xKey,
  yKey,
  colors = defaultColors,
  className,
  aspectRatio = 2,
  showGrid = true,
  showLegend = true,
}: LineChartProps) {
  const keys = Array.isArray(yKey) ? yKey : [yKey];
  return (
    <ChartContainer className={cn(className)} aspectRatio={aspectRatio}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          {keys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
