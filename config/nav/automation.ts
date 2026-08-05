/**
 * config/nav/automation.ts
 * Navigation sections for the Automation product.
 */
import {
  Workflow,
  GitBranch,
  FolderTree,
  Play,
  Activity,
  BarChart3,
  FileText,
  Shield,
} from "lucide-react";
import type { NavSection } from "./types";

export const AUTOMATION_NAV: NavSection[] = [
  {
    label: "Automation",
    items: [
      { title: "Overview", href: "/automation", icon: Workflow },
      { title: "Flow Designer", href: "/automation/designer", icon: GitBranch },
      {
        title: "Flow Process", href: "/automation/flow-process", icon: FolderTree,
        children: [
          { title: "Flow Designer", href: "/automation/flow-process" },
          { title: "Enhanced Flow", href: "/automation/flow-process/enhanced" },
        ],
      },
      {
        title: "Workflow Engine", href: "/automation/workflow-engine", icon: Play,
        children: [
          { title: "Engine Dashboard", href: "/automation/workflow-engine" },
          { title: "Monitor", href: "/automation/workflow-engine/monitor" },
        ],
      },
      { title: "Execution Monitor", href: "/automation/monitor", icon: Activity },
      { title: "QMS / Quality", href: "/automation/qms", icon: Shield },
      { title: "SOP Workflows", href: "/automation/sops", icon: FileText },
      { title: "Analytics", href: "/automation/analytics", icon: BarChart3 },
      { title: "Templates", href: "/automation/templates", icon: GitBranch },
    ],
  },
];
