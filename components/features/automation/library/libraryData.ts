import * as React from "react";
import {
  Workflow, FileText, Box, GitBranch, Code,
  Users, Globe, Shield, Briefcase, Monitor,
} from "lucide-react";
import { FLOW_TEMPLATES, type FlowTemplate } from "@/lib/flow-templates";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LibraryItem {
  id: string;
  type: "node" | "template" | "subflow" | "snippet";
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  tags: string[];
  usageCount?: number;
  /** For template items: the full FlowTemplate (nodes + edges included) */
  template?: FlowTemplate;
  /** For node/subflow/snippet items: the node data payload */
  data?: unknown;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibraryCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: LibraryItem[];
}

// ─── Node items ───────────────────────────────────────────────────────────────

const NODE_ITEMS: LibraryItem[] = [
  {
    id: "node-start",
    type: "node",
    name: "Start",
    description: "Entry point for a workflow",
    icon: "🚀",
    category: "nodes",
    tags: ["control", "start"],
    usageCount: 120,
    data: { type: "start", label: "Start", trigger: "manual" },
  },
  {
    id: "node-action",
    type: "node",
    name: "Action",
    description: "Execute an action or task",
    icon: "⚡",
    category: "nodes",
    tags: ["action", "execution"],
    usageCount: 95,
    data: { type: "action", label: "Action", actionType: "execute" },
  },
  {
    id: "node-approval",
    type: "node",
    name: "Approval",
    description: "Request human approval with SLA",
    icon: "✅",
    category: "nodes",
    tags: ["approval", "human", "decision"],
    usageCount: 88,
    data: { type: "approval", label: "Approval", assigneeRole: "" },
  },
  {
    id: "node-decision",
    type: "node",
    name: "Decision",
    description: "Branch based on a condition",
    icon: "🔀",
    category: "nodes",
    tags: ["control", "branch", "condition"],
    usageCount: 78,
    data: { type: "decision", label: "Decision", condition: "" },
  },
  {
    id: "node-parallel",
    type: "node",
    name: "Parallel",
    description: "Execute multiple branches simultaneously",
    icon: "⚙️",
    category: "nodes",
    tags: ["parallel", "concurrent", "control"],
    usageCount: 42,
    data: { type: "parallel", label: "Parallel", groupType: "parallel" },
  },
  {
    id: "node-email",
    type: "node",
    name: "Send Email",
    description: "Send an email notification",
    icon: "✉️",
    category: "nodes",
    tags: ["email", "notification", "communication"],
    usageCount: 65,
    data: { type: "email", label: "Send Email", subject: "" },
  },
  {
    id: "node-end",
    type: "node",
    name: "End",
    description: "Terminal node — workflow complete",
    icon: "🏁",
    category: "nodes",
    tags: ["control", "end", "terminal"],
    usageCount: 120,
    data: { type: "end", label: "Complete", result: "success" },
  },
  {
    id: "node-trigger",
    type: "node",
    name: "Trigger",
    description: "Event or schedule trigger",
    icon: "🔔",
    category: "nodes",
    tags: ["trigger", "event", "schedule"],
    usageCount: 55,
    data: { type: "trigger", label: "Trigger", event: "" },
  },
];

// ─── Template items — built from the real registry ────────────────────────────

const TEMPLATE_ITEMS: LibraryItem[] = FLOW_TEMPLATES.map((tpl) => ({
  id: `tpl-${tpl.id}`,
  type: "template" as const,
  name: tpl.name,
  description: tpl.description,
  icon: "📋",
  category: "templates",
  tags: tpl.tags,
  usageCount: Math.floor(Math.random() * 80 + 10),
  template: tpl,
  data: { nodes: tpl.nodes, edges: tpl.edges },
}));

// ─── Subflow items ────────────────────────────────────────────────────────────

const SUBFLOW_ITEMS: LibraryItem[] = [
  {
    id: "sub-email-notify",
    type: "subflow",
    name: "Email Notification",
    description: "Send email with template and attachments",
    icon: "✉️",
    category: "subflows",
    tags: ["email", "notification"],
    usageCount: 28,
    data: { nodes: [], edges: [] },
  },
  {
    id: "sub-approval-escalation",
    type: "subflow",
    name: "Approval + Escalation",
    description: "Request approval with SLA-based escalation to manager",
    icon: "🔺",
    category: "subflows",
    tags: ["approval", "escalation", "sla"],
    usageCount: 22,
    data: { nodes: [], edges: [] },
  },
  {
    id: "sub-doc-verification",
    type: "subflow",
    name: "Document Verification",
    description: "OCR, classify and validate uploaded documents",
    icon: "📄",
    category: "subflows",
    tags: ["document", "ocr", "verification"],
    usageCount: 18,
    data: { nodes: [], edges: [] },
  },
  {
    id: "sub-statutory-calc",
    type: "subflow",
    name: "Statutory Calculations",
    description: "Calculate EPF, SOCSO, EIS and PCB for a salary amount",
    icon: "🧮",
    category: "subflows",
    tags: ["payroll", "statutory", "epf", "socso"],
    usageCount: 15,
    data: { nodes: [], edges: [] },
  },
];

// ─── Snippet items ────────────────────────────────────────────────────────────

const SNIPPET_ITEMS: LibraryItem[] = [
  {
    id: "snp-http",
    type: "snippet",
    name: "HTTP Request",
    description: "Make an authenticated HTTP request with retry and error handling",
    icon: "🌐",
    category: "snippets",
    tags: ["api", "http", "request"],
    usageCount: 15,
    data: { code: "// fetch with retry\nasync function request(url, options) { ... }" },
  },
  {
    id: "snp-date-diff",
    type: "snippet",
    name: "Date Difference",
    description: "Calculate working days between two dates (MY public holidays aware)",
    icon: "📅",
    category: "snippets",
    tags: ["date", "calendar", "malaysia"],
    usageCount: 12,
    data: { code: "// workingDaysBetween(start, end)" },
  },
  {
    id: "snp-epf-calc",
    type: "snippet",
    name: "EPF Calculator",
    description: "Employee & employer EPF contributions by age tier",
    icon: "🧮",
    category: "snippets",
    tags: ["epf", "statutory", "calculation"],
    usageCount: 20,
    data: { code: "function calcEpf(gross, age) { ... }" },
  },
  {
    id: "snp-send-email",
    type: "snippet",
    name: "Send Transactional Email",
    description: "Send email via the notification service with template rendering",
    icon: "📧",
    category: "snippets",
    tags: ["email", "notification", "template"],
    usageCount: 18,
    data: { code: "await notificationService.sendEmail({ to, subject, template })" },
  },
];

// ─── Category registry ────────────────────────────────────────────────────────

export const libraryData: LibraryCategory[] = [
  {
    id: "nodes",
    label: "Nodes",
    icon: React.createElement(Box, { className: "h-4 w-4" }),
    items: NODE_ITEMS,
  },
  {
    id: "templates",
    label: "Templates",
    icon: React.createElement(FileText, { className: "h-4 w-4" }),
    items: TEMPLATE_ITEMS,
  },
  {
    id: "subflows",
    label: "Subflows",
    icon: React.createElement(GitBranch, { className: "h-4 w-4" }),
    items: SUBFLOW_ITEMS,
  },
  {
    id: "snippets",
    label: "Snippets",
    icon: React.createElement(Code, { className: "h-4 w-4" }),
    items: SNIPPET_ITEMS,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getFilteredItems = (search: string): LibraryItem[] => {
  const lower = search.toLowerCase();
  return libraryData
    .flatMap((c) => c.items)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.tags.some((t) => t.toLowerCase().includes(lower))
    );
};

export const getItemById = (id: string): LibraryItem | undefined =>
  libraryData.flatMap((c) => c.items).find((item) => item.id === id);
