import { z } from "zod";

export type WorkflowStepStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED";

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: WorkflowStepStatus;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
}

export type WorkflowType =
  | "ONBOARDING"
  | "VISA_RENEWAL"
  | "CONTRACT_RENEWAL"
  | "LEAVE_REQUEST"
  | "DOCUMENT_SUBMISSION"
  | "REPATRIATION"
  | "EXPAT_ONBOARDING"
  | "EXPAT_RELOCATION"
  | "EXPAT_RENEWAL";

// Import full WORKFLOW_DEFINITIONS from schemas (SSOT)
export type { WorkflowDefinitionSchema as WorkflowDefinition } from "@/lib/schemas";
export { WORKFLOW_DEFINITIONS } from "@/lib/schemas";

export { WorkflowTypeSchema } from "@/lib/schemas";
