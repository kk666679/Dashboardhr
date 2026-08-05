// lib/automation.ts
import type { AppRouter } from "@/server/root";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// ── Types inferred from your server router ────────────────────────────────
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

// Automation router is nested under appRouter as `automation`
type AutomationRouterInput = RouterInput extends { automation: infer A } ? A : never;
type AutomationRouterOutput = RouterOutput extends { automation: infer A } ? A : never;

export type Automation = AutomationRouterOutput extends { getAll: (infer T)[] } ? T : never;
export type AutomationInput = AutomationRouterInput extends { create: infer T } ? T : never;
export type AutomationUpdateInput = AutomationRouterInput extends { update: infer T } ? T : never;

// ── Constants ───────────────────────────────────────────────────────────────
export const AUTOMATION_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  ARCHIVED: "archived",
} as const;

export const AUTOMATION_TRIGGER = {
  SCHEDULE: "schedule",
  WEBHOOK: "webhook",
  EVENT: "event",
} as const;

export const AUTOMATION_ACTION = {
  EMAIL: "email",
  SLACK: "slack",
  WEBHOOK: "webhook",
  UPDATE_RECORD: "updateRecord",
  CREATE_RECORD: "createRecord",
  APPROVAL: "approval",
} as const;

export type AutomationStatus = typeof AUTOMATION_STATUS[keyof typeof AUTOMATION_STATUS];
export type AutomationTrigger = typeof AUTOMATION_TRIGGER[keyof typeof AUTOMATION_TRIGGER];
export type AutomationAction = typeof AUTOMATION_ACTION[keyof typeof AUTOMATION_ACTION];

// ── Utility functions ──────────────────────────────────────────────────────
export function getStatusLabel(status: AutomationStatus): string {
  const map: Record<AutomationStatus, string> = {
    draft: "Draft",
    active: "Active",
    paused: "Paused",
    archived: "Archived",
  };
  return map[status] ?? status;
}

export function getTriggerLabel(trigger: AutomationTrigger): string {
  const map: Record<AutomationTrigger, string> = {
    schedule: "Schedule",
    webhook: "Webhook",
    event: "Event",
  };
  return map[trigger] ?? trigger;
}

export function getActionLabel(action: AutomationAction): string {
  const map: Record<AutomationAction, string> = {
    email: "Send Email",
    slack: "Send Slack Message",
    webhook: "Call Webhook",
    updateRecord: "Update Record",
    createRecord: "Create Record",
    approval: "Request Approval",
  };
  return map[action] ?? action;
}

export function formatAutomationName(name: string, maxLength = 30): string {
  return name.length > maxLength ? name.slice(0, maxLength) + "…" : name;
}
