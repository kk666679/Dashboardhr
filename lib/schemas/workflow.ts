/**
 * lib/schemas/workflow.ts
 * Workflow type, step, definition schemas and the canonical WORKFLOW_DEFINITIONS map.
 */
import { z } from "zod";

export const WorkflowTypeSchema = z.enum([
  "ONBOARDING",
  "VISA_RENEWAL",
  "CONTRACT_RENEWAL",
  "LEAVE_REQUEST",
  "DOCUMENT_SUBMISSION",
  "REPATRIATION",
  "EXPAT_ONBOARDING",
  "EXPAT_RELOCATION",
  "EXPAT_RENEWAL",
]);

export const WorkflowStepStatusSchema = z.enum([
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "SKIPPED",
]);

export type WorkflowStepStatus = z.infer<typeof WorkflowStepStatusSchema>;

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

export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: WorkflowStepStatusSchema,
  assignedTo: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const WorkflowDefinitionSchema = z.object({
  type: WorkflowTypeSchema,
  steps: z.array(WorkflowStepSchema),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const WORKFLOW_DEFINITIONS: Record<
  z.infer<typeof WorkflowTypeSchema>,
  z.infer<typeof WorkflowDefinitionSchema>
> = {
  ONBOARDING: {
    type: "ONBOARDING",
    steps: [
      { id: "step_1", name: "Pre-Arrival Preparation", description: "Prepare offer letter, employment contract, and documentation", status: "PENDING" },
      { id: "step_2", name: "Document Collection", description: "Collect passport, visa, medical examination results", status: "PENDING" },
      { id: "step_3", name: "Customs Clearance", description: "Complete customs entry procedures", status: "PENDING" },
      { id: "step_4", name: "Accommodation Setup", description: "Arrange accommodation and register with local authorities", status: "PENDING" },
      { id: "step_5", name: "Banking & Tax Registration", description: "Open bank account and register for tax ID", status: "PENDING" },
      { id: "step_6", name: "Workplace Orientation", description: "Complete orientation and safety training", status: "PENDING" },
    ],
  },
  VISA_RENEWAL: {
    type: "VISA_RENEWAL",
    steps: [
      { id: "step_1", name: "Request Initiation", description: "Employee or HR initiates visa renewal request", status: "PENDING" },
      { id: "step_2", name: "Document Review", description: "HR reviews and verifies required documents", status: "PENDING" },
      { id: "step_3", name: "Government Submission", description: "Submit application to immigration authority", status: "PENDING" },
      { id: "step_4", name: "Processing & Approval", description: "Wait for government processing and approval", status: "PENDING" },
      { id: "step_5", name: "Visa Issuance", description: "Receive and verify visa issuance", status: "PENDING" },
    ],
  },
  CONTRACT_RENEWAL: {
    type: "CONTRACT_RENEWAL",
    steps: [
      { id: "step_1", name: "Renewal Notice", description: "Send renewal notice to employee", status: "PENDING" },
      { id: "step_2", name: "Negotiation", description: "Employee and employer negotiate terms", status: "PENDING" },
      { id: "step_3", name: "Contract Preparation", description: "Prepare new contract with agreed terms", status: "PENDING" },
      { id: "step_4", name: "E-Signature", description: "Employee signs contract electronically", status: "PENDING" },
      { id: "step_5", name: "Verification", description: "HR verifies and stores contract", status: "PENDING" },
    ],
  },
  LEAVE_REQUEST: {
    type: "LEAVE_REQUEST",
    steps: [
      { id: "step_1", name: "Request Submission", description: "Employee submits leave request", status: "PENDING" },
      { id: "step_2", name: "Department Approval", description: "Department head approves request", status: "PENDING" },
      { id: "step_3", name: "HR Verification", description: "HR verifies leave balance", status: "PENDING" },
      { id: "step_4", name: "Final Approval", description: "HR manager final approval", status: "PENDING" },
    ],
  },
  DOCUMENT_SUBMISSION: {
    type: "DOCUMENT_SUBMISSION",
    steps: [
      { id: "step_1", name: "Document Upload", description: "Employee uploads required documents", status: "PENDING" },
      { id: "step_2", name: "Initial Verification", description: "Check document completeness and format", status: "PENDING" },
      { id: "step_3", name: "Compliance Review", description: "Review against compliance requirements", status: "PENDING" },
      { id: "step_4", name: "Approval", description: "Final approval and archival", status: "PENDING" },
    ],
  },
  REPATRIATION: {
    type: "REPATRIATION",
    steps: [
      { id: "step_1", name: "Exit Notice", description: "Issue exit notice and initiate repatriation", status: "PENDING" },
      { id: "step_2", name: "Exit Permit Application", description: "Apply for exit permit and clearance", status: "PENDING" },
    ],
  },
  EXPAT_ONBOARDING: {
    type: "EXPAT_ONBOARDING",
    steps: [
      { id: "step_1", name: "Visa & Permit Processing", description: "Complete immigration processing (PLKS/MMP)", status: "PENDING" },
      { id: "step_2", name: "Pre-Departure Briefing", description: "Cultural/HR orientation for Malaysia", status: "PENDING" },
      { id: "step_3", name: "Travel & Insurance", description: "Book flights and medical insurance", status: "PENDING" },
      { id: "step_4", name: "Arrival Clearance", description: "Quarantine and entry procedures", status: "PENDING" },
      { id: "step_5", name: "Local Setup", description: "Bank account, tax reg, FOMEMA medical", status: "PENDING" },
    ],
  },
  EXPAT_RELOCATION: {
    type: "EXPAT_RELOCATION",
    steps: [
      { id: "step_1", name: "Relocation Planning", description: "Logistics and family support", status: "PENDING" },
      { id: "step_2", name: "Housing Assignment", description: "Company accommodation setup", status: "PENDING" },
      { id: "step_3", name: "Work Permit Update", description: "Update worksite if internal transfer", status: "PENDING" },
      { id: "step_4", name: "Orientation", description: "New site orientation and training", status: "PENDING" },
    ],
  },
  EXPAT_RENEWAL: {
    type: "EXPAT_RENEWAL",
    steps: [
      { id: "step_1", name: "Eligibility Check", description: "Review performance and compliance", status: "PENDING" },
      { id: "step_2", name: "Document Renewal", description: "Visa/permit/medical renewal", status: "PENDING" },
      { id: "step_3", name: "Tax Update", description: "Update tax residency status", status: "PENDING" },
      { id: "step_4", name: "Contract Extension", description: "New terms negotiation", status: "PENDING" },
      { id: "step_5", name: "Levy Payment", description: "Pay renewal levy", status: "PENDING" },
    ],
  },
};
