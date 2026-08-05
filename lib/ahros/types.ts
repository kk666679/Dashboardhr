/**
 * Core AHROS (Autonomous HR Operations System) Types
 *
 * These types define the foundational data structures for the
 * agentic workspace where AI plans, executes, documents, learns,
 * and collaborates through interactive artifacts.
 */

import { z } from "zod";

// ─── Business Event ──────────────────────────────────────────────────────────

export type BusinessEventType =
  | "WORK_PERMIT_RENEWAL"
  | "EMPLOYEE_ONBOARDING"
  | "EMPLOYEE_OFFBOARDING"
  | "CONTRACT_RENEWAL"
  | "LEAVE_REQUEST"
  | "DOCUMENT_SUBMISSION"
  | "REPATRIATION"
  | "VISA_APPLICATION"
  | "COMPLIANCE_AUDIT"
  | "PAYROLL_PROCESSING"
  | "TRAINING_REQUEST"
  | "RECRUITMENT_REQUEST"
  | "PERMIT_APPLICATION"
  | "MEDICAL_EXAMINATION"
  | "GENERAL_QUERY";

export interface BusinessEvent {
  id: string;
  type: BusinessEventType;
  title: string;
  description: string;
  initiatedBy: string;
  employeeId?: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// ─── Artifact System ─────────────────────────────────────────────────────────

export type ArtifactType =
  | "conversation"
  | "plan"
  | "workflow"
  | "reasoning"
  | "timeline"
  | "compliance"
  | "checkpoint"
  | "knowledge-tree"
  | "sandbox"
  | "memory"
  | "sop"
  | "audit"
  | "report"
  | "diagram";

export type ArtifactStatus =
  | "pending"
  | "streaming"
  | "active"
  | "completed"
  | "failed"
  | "archived";

export interface ArtifactMeta {
  id: string;
  type: ArtifactType;
  title: string;
  description?: string;
  status: ArtifactStatus;
  version: number;
  parentId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  size?: number;
  syncStatus: "synced" | "syncing" | "dirty" | "conflict";
}

export interface ArtifactRecord<T = unknown> {
  meta: ArtifactMeta;
  data: T;
  previousVersions?: { version: number; data: T; timestamp: Date }[];
  checksum?: string;
}

// ─── Sync Events (Event Bus) ─────────────────────────────────────────────────

export type SyncEventType =
  | "ARTIFACT_CREATED"
  | "ARTIFACT_UPDATED"
  | "ARTIFACT_ARCHIVED"
  | "ARTIFACT_SYNC_START"
  | "ARTIFACT_SYNC_COMPLETE"
  | "ARTIFACT_SYNC_ERROR"
  | "WORKSPACE_STATE_CHANGED"
  | "EXECUTION_STARTED"
  | "EXECUTION_STEP_COMPLETED"
  | "EXECUTION_COMPLETED"
  | "EXECUTION_FAILED"
  | "EXECUTION_PAUSED"
  | "EXECUTION_RESUMED"
  | "PLAN_GENERATED"
  | "PLAN_UPDATED"
  | "COMPLIANCE_CHECKED"
  | "CHECKPOINT_CREATED"
  | "LEARNING_CAPTURED"
  | "MEMORY_UPDATED";

export interface SyncEvent {
  id: string;
  type: SyncEventType;
  artifactId?: string;
  artifactType?: ArtifactType;
  payload?: unknown;
  timestamp: Date;
  source: string;
}

// ─── Planning ────────────────────────────────────────────────────────────────

export interface PlanTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed" | "skipped";
  dependencies: string[];
  assignedTo?: string;
  estimatedDuration?: number; // minutes
  risk: "LOW" | "MEDIUM" | "HIGH";
  requiredApprovals?: string[];
  confidence: number; // 0-1
}

export interface Plan {
  id: string;
  goal: string;
  tasks: PlanTask[];
  dependencies: string[][]; // adjacency
  totalEstimatedDuration: number;
  riskScore: number; // 0-1
  confidence: number; // 0-1
  generatedAt: Date;
  updatedAt: Date;
  status: "draft" | "active" | "completed" | "failed";
}

// ─── Execution ───────────────────────────────────────────────────────────────

export type StepStatus =
  | "pending"
  | "running"
  | "retrying"
  | "waiting_approval"
  | "approved"
  | "completed"
  | "failed"
  | "skipped";

export interface ExecutionStep {
  id: string;
  taskId: string;
  name: string;
  status: StepStatus;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  error?: string;
  retryCount: number;
  maxRetries: number;
  output?: unknown;
  logs: string[];
}

export interface ExecutionState {
  id: string;
  businessEventId: string;
  planId: string;
  status: "idle" | "running" | "paused" | "completed" | "failed" | "cancelled";
  currentStepIndex: number;
  steps: ExecutionStep[];
  startedAt?: Date;
  completedAt?: Date;
  logs: string[];
  metadata?: Record<string, unknown>;
}

// ─── Compliance ──────────────────────────────────────────────────────────────

export type ComplianceSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ComplianceCheck {
  id: string;
  rule: string;
  description: string;
  status: "pass" | "fail" | "warning" | "not_applicable";
  severity: ComplianceSeverity;
  detail?: string;
  reference?: string;
  remediation?: string;
}

export interface ComplianceReport {
  id: string;
  businessEventId: string;
  overallStatus: "compliant" | "non_compliant" | "partial";
  score: number; // 0-100
  checks: ComplianceCheck[];
  generatedAt: Date;
  summary: string;
}

// ─── Learning & Memory ───────────────────────────────────────────────────────

export type LearningEventType =
  | "execution_success"
  | "execution_failure"
  | "human_correction"
  | "policy_update"
  | "workflow_optimization"
  | "user_feedback";

export interface LearningEvent {
  id: string;
  type: LearningEventType;
  source: string;
  context: string;
  outcome: string;
  recommendation?: string;
  timestamp: Date;
  applied: boolean;
  tags: string[];
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: unknown;
  type: "pattern" | "preference" | "correction" | "suggestion" | "policy";
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
  ttl?: number; // days
}

// ─── Workspace ───────────────────────────────────────────────────────────────

export type PanelId =
  | "conversation"
  | "planning"
  | "workflow"
  | "reasoning"
  | "timeline"
  | "compliance"
  | "knowledge"
  | "sandbox"
  | "memory";

export interface PanelConfig {
  id: PanelId;
  label: string;
  visible: boolean;
  order: number;
  size?: number; // flex ratio
  collapsed?: boolean;
  position?: "left" | "center" | "right" | "bottom" | "floating";
}

export interface WorkspaceConfig {
  id: string;
  name: string;
  panels: PanelConfig[];
  activeArtifactId?: string;
  theme?: "light" | "dark" | "system";
  autoSave: boolean;
}

// ─── Zod Schemas (for validation) ───────────────────────────────────────────

export const BusinessEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    "WORK_PERMIT_RENEWAL",
    "EMPLOYEE_ONBOARDING",
    "EMPLOYEE_OFFBOARDING",
    "CONTRACT_RENEWAL",
    "LEAVE_REQUEST",
    "DOCUMENT_SUBMISSION",
    "REPATRIATION",
    "VISA_APPLICATION",
    "COMPLIANCE_AUDIT",
    "PAYROLL_PROCESSING",
    "TRAINING_REQUEST",
    "RECRUITMENT_REQUEST",
    "PERMIT_APPLICATION",
    "MEDICAL_EXAMINATION",
    "GENERAL_QUERY",
  ]),
  title: z.string(),
  description: z.string(),
  initiatedBy: z.string(),
  employeeId: z.string().optional(),
  tenantId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export const ArtifactMetaSchema = z.object({
  id: z.string(),
  type: z.enum([
    "conversation",
    "plan",
    "workflow",
    "reasoning",
    "timeline",
    "compliance",
    "checkpoint",
    "knowledge-tree",
    "sandbox",
    "memory",
    "sop",
    "audit",
    "report",
    "diagram",
  ]),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["pending", "streaming", "active", "completed", "failed", "archived"]),
  version: z.number(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().optional(),
  size: z.number().optional(),
  syncStatus: z.enum(["synced", "syncing", "dirty", "conflict"]),
});

export const ArtifactRecordSchema = z.object({
  meta: ArtifactMetaSchema,
  data: z.unknown(),
  previousVersions: z
    .array(
      z.object({
        version: z.number(),
        data: z.unknown(),
        timestamp: z.date(),
      })
    )
    .optional(),
  checksum: z.string().optional(),
});

export const SyncEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    "ARTIFACT_CREATED",
    "ARTIFACT_UPDATED",
    "ARTIFACT_ARCHIVED",
    "ARTIFACT_SYNC_START",
    "ARTIFACT_SYNC_COMPLETE",
    "ARTIFACT_SYNC_ERROR",
    "WORKSPACE_STATE_CHANGED",
    "EXECUTION_STARTED",
    "EXECUTION_STEP_COMPLETED",
    "EXECUTION_COMPLETED",
    "EXECUTION_FAILED",
    "EXECUTION_PAUSED",
    "EXECUTION_RESUMED",
    "PLAN_GENERATED",
    "PLAN_UPDATED",
    "COMPLIANCE_CHECKED",
    "CHECKPOINT_CREATED",
    "LEARNING_CAPTURED",
    "MEMORY_UPDATED",
  ]),
  artifactId: z.string().optional(),
  artifactType: z
    .enum([
      "conversation",
      "plan",
      "workflow",
      "reasoning",
      "timeline",
      "compliance",
      "checkpoint",
      "knowledge-tree",
      "sandbox",
      "memory",
      "sop",
      "audit",
      "report",
      "diagram",
    ])
    .optional(),
  payload: z.unknown().optional(),
  timestamp: z.date(),
  source: z.string(),
});
