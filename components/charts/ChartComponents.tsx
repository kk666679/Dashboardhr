import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  appArea,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Treemap,
  Funnel,
  FunnelChart,
} from 'recharts';

// Color palettes
export const COLORS = {
  primary: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
  gradient: ['#EC4899', '#F472B6', '#FB7185', '#FDA4AF', '#FECDD3'],
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
  info: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
  multi: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
};

// Custom Tooltip
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-purple-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Trend Line Chart
interface TrendLineChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  xAxisKey: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  curved?: boolean;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showLegend = true,
  showGrid = true,
  curved = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis dataKey={xAxisKey} stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {dataKeys.map((item, index) => (
          <Line
            key={index}
            type={curved ? 'monotone' : 'linear'}
            dataKey={item.key}
            name={item.name}
            stroke={item.color}
            strokeWidth={3}
            dot={{ fill: item.color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Multi Bar Chart
interface MultiBarChartProps {
  data: any[];
  bars: { key: string; name: string; color: string }[];
  xAxisKey: string;
  height?: number;
  showLegend?: boolean;
  stacked?: boolean;
}

export const MultiBarChart: React.FC<MultiBarChartProps> = ({
  data,
  bars,
  xAxisKey,
  height = 300,
  showLegend = true,
  stacked = false,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey={xAxisKey} stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            radius={[8, 8, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Area Chart with Gradient
interface GradientAreaChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  xAxisKey: string;
  height?: number;
  showLegend?: boolean;
  stacked?: boolean;
}

export const GradientAreaChart: React.FC<GradientAreaChartProps> = ({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showLegend = true,
  stacked = false,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          {dataKeys.map((item, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={item.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey={xAxisKey} stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {dataKeys.map((item, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={item.key}
            name={item.name}
            stroke={item.color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${index})`}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Donut/Pie Chart
interface DonutChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
  innerRadius?: number;
  showLabel?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors = COLORS.multi,
  height = 300,
  innerRadius = 60,
  showLabel = true,
}) => {
  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={showLabel ? renderLabel : false}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Radar Chart for Skills/Performance
interface SkillsRadarChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  height?: number;
}

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({
  data,
  dataKeys,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis dataKey="skill" stroke="#6B7280" />
        <PolarRadiusAxis stroke="#6B7280" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {dataKeys.map((item, index) => (
          <Radar
            key={index}
            name={item.name}
            dataKey={item.key}
            stroke={item.color}
            fill={item.color}
            fillOpacity={0.3}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Composed Chart (Line + Bar)
interface ComposedChartProps {
  data: any[];
  bars: { key: string; name: string; color: string }[];
  lines: { key: string; name: string; color: string }[];
  xAxisKey: string;
  height?: number;
}

export const CustomComposedChart: React.FC<ComposedChartProps> = ({
  data,
  bars,
  lines,
  xAxisKey,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey={xAxisKey} stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            radius={[8, 8, 0, 0]}
          />
        ))}
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color}
            strokeWidth={3}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Radial Progress Bar
interface RadialProgressProps {
  data: { name: string; value: number; fill: string }[];
  height?: number;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({
  data,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        innerRadius="10%"
        outerRadius="90%"
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarGrid gridType="circle" stroke="#E5E7EB" />
        <RadialBar
          minAngle={15}
          background
          clockWise
          dataKey="value"
          cornerRadius={10}
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
        <Tooltip content={<CustomTooltip />} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// Scatter Chart for Correlation
interface ScatterPlotProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xKey,
  yKey,
  color = '#8B5CF6',
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey={xKey} name={xKey} stroke="#6B7280" />
        <YAxis dataKey={yKey} name={yKey} stroke="#6B7280" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Scatter name="Data" data={data} fill={color} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// Funnel Chart for Conversion
interface FunnelChartProps {
  data: { name: string; value: number; fill: string }[];
  height?: number;
}

export const ConversionFunnel: React.FC<FunnelChartProps> = ({
  data,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <FunnelChart>
        <Tooltip content={<CustomTooltip />} />
        <Funnel dataKey="value" data={data} isAnimationActive>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};

// Treemap for Hierarchical Data
interface TreemapChartProps {
  data: any[];
  height?: number;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({
  data,
  height = 300,
}) => {
  const COLORS_TREEMAP = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="size"
        stroke="#fff"
        fill="#8B5CF6"
        content={<CustomTreemapContent />}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, index, name, size } = props;
  const COLORS_TREEMAP = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS_TREEMAP[index % COLORS_TREEMAP.length],
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />
      {width > 50 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
};

// Horizontal Bar Chart
interface HorizontalBarChartProps {
  data: any[];
  dataKey: string;
  categoryKey: string;
  color?: string;
  height?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  dataKey,
  categoryKey,
  color = '#8B5CF6',
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis type="number" stroke="#6B7280" />
        <YAxis dataKey={categoryKey} type="category" stroke="#6B7280" width={100} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
