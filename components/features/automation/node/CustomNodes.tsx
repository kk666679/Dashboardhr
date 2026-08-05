"use client";

import type { Node, NodeProps } from "@xyflow/react";
import type { AutomationNodeData } from "./types";
import { NodeBase } from "./NodeBase";
import {
  User,
  Users,
  LayoutGrid,
  Circle,
  Diamond,
  Hexagon,
  RectangleHorizontal,
  StickyNote,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// ─── Data types for custom nodes ──────────────────────────────────────────
export interface EnhancedEmployeeNodeData {
  label?: string;
  description?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "on-leave";
  avatar?: string;
}

export interface DepartmentGroupNodeData {
  label?: string;
  description?: string;
  department: string;
  employeeCount?: number;
  manager?: string;
  color?: string;
}

export interface CompactCardNodeData {
  label?: string;
  description?: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export interface CircularNodeData {
  label?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface DiamondNodeData {
  label?: string;
  description?: string;
  color?: string;
}

export interface HexagonNodeData {
  label?: string;
  description?: string;
  color?: string;
}

export interface StadiumNodeData {
  label?: string;
  description?: string;
  color?: string;
}

export interface AnnotationNodeData {
  label?: string;
  description?: string;
  note: string;
  author?: string;
  timestamp?: string;
}

export interface MetricCardNodeData {
  label?: string;
  description?: string;
  metric: string;
  value: number | string;
  unit?: string;
  change?: number;
  target?: number;
  status?: "on-track" | "at-risk" | "behind";
}

// ─── EnhancedEmployeeNode ──────────────────────────────────────────────────
export function EnhancedEmployeeNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-400",
    "on-leave": "bg-yellow-500",
  };

  return (
    <NodeBase
      icon={<User className="h-5 w-5 text-blue-600" />}
      label={data?.name || "Employee"}
      description={data?.role || "Employee"}
      selected={selected}
      variant="default"
    >
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Department:</span>
          <span>{data?.department}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={data?.status === "active" ? "success" : data?.status === "on-leave" ? "warning" : "secondary"}>
            {data?.status}
          </Badge>
        </div>
      </div>
    </NodeBase>
  );
}

// ─── DepartmentGroupNode ──────────────────────────────────────────────────
export function DepartmentGroupNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  return (
    <NodeBase
      icon={<Users className="h-5 w-5 text-purple-600" />}
      label={data?.department || "Department"}
      description={data?.description || "Department group"}
      selected={selected}
      variant="workflow"
      badge={data?.employeeCount ? `${data.employeeCount} employees` : undefined}
    >
      <div className="space-y-1 text-xs">
        {data?.manager && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Manager:</span>
            <span>{data.manager}</span>
          </div>
        )}
        {data?.color && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Color:</span>
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: data.color }} />
          </div>
        )}
      </div>
    </NodeBase>
  );
}

// ─── CompactCardNode ──────────────────────────────────────────────────────
export function CompactCardNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  return (
    <NodeBase
      icon={<LayoutGrid className="h-4 w-4 text-gray-600" />}
      label={data?.label || "Card"}
      description={data?.description || "Compact card"}
      selected={selected}
      variant="default"
    >
      <div className="space-y-1 text-xs">
        <div className="text-lg font-semibold">{data?.value}</div>
        {data?.subtitle && <div className="text-muted-foreground">{data.subtitle}</div>}
        {data?.trend && (
          <div className={`flex items-center gap-1 ${data.trend === "up" ? "text-green-600" : data.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
            {data.trend === "up" ? "↑" : data.trend === "down" ? "↓" : "→"}
            <span>{data.trendValue}</span>
          </div>
        )}
      </div>
    </NodeBase>
  );
}

// ─── CircularNode ──────────────────────────────────────────────────────────
export function CircularNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const color = data?.color || "#3b82f6";
  return (
    <div
      className={`flex flex-col items-center justify-center w-24 h-24 rounded-full shadow-md hover:shadow-lg transition-shadow ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      style={{ backgroundColor: color, color: "white" }}
    >
      <span className="text-2xl">{data?.icon || "●"}</span>
      <span className="text-sm font-medium mt-1 truncate max-w-[80px] text-center">
        {data?.label || "Circle"}
      </span>
    </div>
  );
}

// ─── DiamondNode ──────────────────────────────────────────────────────────
export function DiamondNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const color = data?.color || "#8b5cf6";
  return (
    <div
      className={`flex items-center justify-center w-28 h-28 shadow-md hover:shadow-lg transition-shadow transform rotate-45 ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="transform -rotate-45 text-white text-center">
        <span className="text-sm font-medium truncate max-w-[60px] block">
          {data?.label || "Diamond"}
        </span>
      </div>
    </div>
  );
}

// ─── HexagonNode ──────────────────────────────────────────────────────────
export function HexagonNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const color = data?.color || "#22c55e";
  return (
    <div
      className={`flex items-center justify-center w-28 h-28 shadow-md hover:shadow-lg transition-shadow clip-path-hexagon ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="text-white text-center">
        <span className="text-sm font-medium truncate max-w-[60px] block">
          {data?.label || "Hexagon"}
        </span>
      </div>
    </div>
  );
}

// ─── StadiumNode ──────────────────────────────────────────────────────────
export function StadiumNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const color = data?.color || "#ec4899";
  return (
    <div
      className={`flex items-center justify-center px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-shadow ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      style={{ backgroundColor: color, color: "white" }}
    >
      <span className="text-sm font-medium truncate max-w-[120px]">
        {data?.label || "Stadium"}
      </span>
    </div>
  );
}

// ─── AnnotationNode ──────────────────────────────────────────────────────
export function AnnotationNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  return (
    <NodeBase
      icon={<StickyNote className="h-5 w-5 text-yellow-600" />}
      label={data?.label || "Note"}
      description={data?.description || "Annotation"}
      selected={selected}
      variant="default"
    >
      <div className="space-y-1 text-xs">
        <div className="italic text-muted-foreground">{data?.note}</div>
        {data?.author && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>— {data.author}</span>
            {data.timestamp && <span>{new Date(data.timestamp).toLocaleDateString()}</span>}
          </div>
        )}
      </div>
    </NodeBase>
  );
}

// ─── MetricCardNode ──────────────────────────────────────────────────────
export function MetricCardNode({ data, selected }: NodeProps<Node<AutomationNodeData, string | undefined>>) {
  const statusColors = {
    "on-track": "border-green-500",
    "at-risk": "border-yellow-500",
    "behind": "border-red-500",
  };

  return (
    <NodeBase
      icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
      label={data?.label || "Metric"}
      description={data?.description || "Metric card"}
      selected={selected}
      variant="default"
    >
      <div className="space-y-1 text-xs">
        <div className="text-lg font-bold">{data?.value}{data?.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{data.unit}</span>}</div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{data?.metric}</span>
          {data?.change !== undefined && (
            <span className={data.change > 0 ? "text-green-600" : data.change < 0 ? "text-red-600" : "text-gray-600"}>
              {data.change > 0 ? "+" : ""}{data.change}%
            </span>
          )}
        </div>
        {data?.target !== undefined && (
          <div className="text-muted-foreground">Target: {data.target}</div>
        )}
        {data?.status && (
          <Badge variant={data.status === "on-track" ? "success" : data.status === "at-risk" ? "warning" : "destructive"}>
            {data.status.replace("-", " ")}
          </Badge>
        )}
      </div>
    </NodeBase>
  );
}

// ─── Hexagon CSS helper ──────────────────────────────────────────────────
// Add this to your global CSS or tailwind config:
// .clip-path-hexagon {
//   clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
// }
