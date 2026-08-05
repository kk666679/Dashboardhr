import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  className?: string;
  aspectRatio?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

const defaultColors = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export function PieChart({
  data,
  colors = defaultColors,
  className,
  aspectRatio = 2,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
}: PieChartProps) {
  return (
    <ChartContainer className={cn(className)} aspectRatio={aspectRatio}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
