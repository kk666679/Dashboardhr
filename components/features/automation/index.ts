"use client";

// ── Core Designer ──────────────────────────────────────────────────────────
export { FlowDesigner, FlowDesignerWithProvider } from "./FlowDesigner";
export type { FlowDesignerProps } from "./FlowDesigner";

// ── Flow Studio (Next-Generation Designer) ─────────────────────────────────
export * from "./flow-studio";

// ── Providers ──────────────────────────────────────────────────────────────
export { AutomationProvider } from "./AutomationProvider";

// ── Navigation ─────────────────────────────────────────────────────────────
export { AutomationNavigation } from "./navigation";

// ── Canvas Components ──────────────────────────────────────────────────────
export * from "./canvas";

// ── Edge Components ────────────────────────────────────────────────────────
export * from "./edge";

// ── Layout Components ──────────────────────────────────────────────────────
export * from "./layout";

// ── Palette Components ─────────────────────────────────────────────────────
export * from "./palette";

// ── Library Components ─────────────────────────────────────────────────────
export * from "./library";

// ── Properties Panel ───────────────────────────────────────────────────────
export * from "./properties";

// ── Nodes ──────────────────────────────────────────────────────────────────
export * from "./node";
export * from "./node/AutomationNodes";
export * from "./node/CustomNodes";

// ── Keyboard Shortcuts ─────────────────────────────────────────────────────
export { KeyboardShortcutsProvider } from "./keyboard/KeyboardShortcutsProvider";

// ── Workflow Engine & Monitor ──────────────────────────────────────────────
export { WorkflowExecutionMonitor } from "./WorkflowExecutionMonitor";

// ── QMS Components ─────────────────────────────────────────────────────────
export * from "./QMS";

// ── Compliance Components ──────────────────────────────────────────────────
export * from "./compliance";

// ── SOP Workflow Components ────────────────────────────────────────────────
export * from "./sop-workflow";

// ── Workflow Engine ────────────────────────────────────────────────────────
export * from "./workflows/workflow-engine";

// ── AutomationAI stub — not yet implemented ───────────────────────────────
export const AutomationAI = () => null;

// Legacy re-export for backward compatibility
export { useFlowOperations } from "../../../hooks/useFlowOperations";
