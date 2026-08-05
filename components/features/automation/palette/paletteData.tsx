"use client";

import {
  Play,
  Square,
  GitBranch,
  Workflow,
  Zap,
  Send,
  HelpCircle,
  FileText,
  Users,
  Clock,
  Bell,
  Mail,
  MessageSquare,
  Database,
  Cloud,
  Code,
  Shield,
  Settings,
} from "lucide-react";

export interface NodePaletteItem {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  favorite?: boolean;
  badge?: string;
  defaultData?: Record<string, any>;
}

export interface NodePaletteCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NodePaletteItem[];
}

// Node data for the palette
export const nodePaletteItems: NodePaletteItem[] = [
  // Control Flow
  {
    id: "start",
    type: "start",
    label: "Start",
    description: "Start a workflow",
    icon: "🚀",
    category: "control",
    defaultData: { trigger: "manual" },
  },
  {
    id: "end",
    type: "end",
    label: "End",
    description: "End a workflow",
    icon: "🏁",
    category: "control",
    defaultData: { result: "success" },
  },
  {
    id: "decision",
    type: "decision",
    label: "Decision",
    description: "Branch based on condition",
    icon: "🔀",
    category: "control",
    defaultData: { condition: "true" },
  },
  {
    id: "condition",
    type: "condition",
    label: "Condition",
    description: "Wait for condition",
    icon: "❓",
    category: "control",
    defaultData: { condition: "wait until" },
  },

  // Actions
  {
    id: "action",
    type: "action",
    label: "Action",
    description: "Execute an action",
    icon: "⚡",
    category: "actions",
    favorite: true,
    defaultData: { actionType: "execute" },
  },
  {
    id: "trigger",
    type: "trigger",
    label: "Trigger",
    description: "Trigger an event",
    icon: "🔔",
    category: "actions",
    defaultData: { event: "on" },
  },
  {
    id: "output",
    type: "output",
    label: "Output",
    description: "Output data",
    icon: "📤",
    category: "actions",
    defaultData: { outputType: "console" },
  },

  // Workflow
  {
    id: "workflow",
    type: "workflow",
    label: "Workflow",
    description: "Embed a sub-workflow",
    icon: "📋",
    category: "workflow",
    favorite: true,
    defaultData: { workflowId: "" },
  },
  {
    id: "subflow",
    type: "subflow",
    label: "Subflow",
    description: "Call another flow",
    icon: "🔄",
    category: "workflow",
    defaultData: { flowId: "" },
  },
  {
    id: "loop",
    type: "loop",
    label: "Loop",
    description: "Iterate over items",
    icon: "🔁",
    category: "workflow",
    defaultData: { iterations: 10 },
  },

  // Communication
  {
    id: "email",
    type: "email",
    label: "Send Email",
    description: "Send an email notification",
    icon: "✉️",
    category: "communication",
    defaultData: { subject: "Notification", body: "Hello" },
  },
  {
    id: "notification",
    type: "notification",
    label: "Notification",
    description: "Send a notification",
    icon: "🔔",
    category: "communication",
    defaultData: { title: "Alert", message: "..." },
  },
  {
    id: "message",
    type: "message",
    label: "Message",
    description: "Send a message",
    icon: "💬",
    category: "communication",
    defaultData: { channel: "slack", text: "..." },
  },

  // Integration
  {
    id: "api",
    type: "api",
    label: "API Call",
    description: "Call an external API",
    icon: "🌐",
    category: "integration",
    defaultData: { method: "GET", url: "" },
  },
  {
    id: "database",
    type: "database",
    label: "Database",
    description: "Query a database",
    icon: "🗄️",
    category: "integration",
    defaultData: { query: "SELECT * FROM" },
  },
  {
    id: "cloud",
    type: "cloud",
    label: "Cloud Service",
    description: "Interact with cloud services",
    icon: "☁️",
    category: "integration",
    defaultData: { service: "aws" },
  },

  // Custom
  {
    id: "custom",
    type: "custom",
    label: "Custom Code",
    description: "Run custom code",
    icon: "💻",
    category: "custom",
    favorite: true,
    defaultData: { code: "// your code" },
  },
  {
    id: "script",
    type: "script",
    label: "Script",
    description: "Execute a script",
    icon: "📜",
    category: "custom",
    defaultData: { language: "javascript", script: "" },
  },
];

// Categories
export const nodeCategories: NodePaletteCategory[] = [
  {
    id: "control",
    label: "Control",
    icon: <GitBranch className="h-4 w-4" />,
    items: nodePaletteItems.filter((item) => item.category === "control"),
  },
  {
    id: "actions",
    label: "Actions",
    icon: <Zap className="h-4 w-4" />,
    items: nodePaletteItems.filter((item) => item.category === "actions"),
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: <Workflow className="h-4 w-4" />,
    items: nodePaletteItems.filter((item) => item.category === "workflow"),
  },
  {
    id: "communication",
    label: "Communication",
    icon: <MessageSquare className="h-4 w-4" />,
    items: nodePaletteItems.filter((item) => item.category === "communication"),
  },
  {
    id: "integration",
    label: "Integration",
    icon: <Cloud className="h-4 w-4" />,
    items: nodePaletteItems.filter((item) => item.category === "integration"),
  },
  {
    id: "custom",
    label: "Custom",
    icon: <Code className="h-4 w-4" />,
    items: nodePaletteItems.filter((item) => item.category === "custom"),
  },
];

export const getFilteredNodes = (search: string): NodePaletteItem[] => {
  const lower = search.toLowerCase();
  return nodePaletteItems.filter(
    (item) =>
      item.label.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower) ||
      item.type.includes(lower)
  );
};

export const getNodeById = (id: string): NodePaletteItem | undefined => {
  return nodePaletteItems.find((item) => item.id === id);
};
