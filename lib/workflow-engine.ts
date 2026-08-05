export enum WorkflowType {
  ONBOARDING = "ONBOARDING",
  VISA_RENEWAL = "VISA_RENEWAL",
  CONTRACT_RENEWAL = "CONTRACT_RENEWAL",
  LEAVE_REQUEST = "LEAVE_REQUEST",
  DOCUMENT_SUBMISSION = "DOCUMENT_SUBMISSION",
  REPATRIATION = "REPATRIATION",
}

export enum WorkflowStatus {
  INITIATED = "INITIATED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED";
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface WorkflowDefinition {
  type: WorkflowType;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
}

// Workflow definitions
export const WORKFLOW_DEFINITIONS: Record<WorkflowType, WorkflowDefinition> = {
  [WorkflowType.ONBOARDING]: {
    type: WorkflowType.ONBOARDING,
    steps: [
      {
        id: "step_1",
        name: "Pre-Arrival Preparation",
        description:
          "Prepare offer letter, employment contract, and documentation",
        status: "PENDING",
      },
      {
        id: "step_2",
        name: "Document Collection",
        description: "Collect passport, visa, medical examination results",
        status: "PENDING",
      },
      {
        id: "step_3",
        name: "Customs Clearance",
        description: "Complete customs entry procedures",
        status: "PENDING",
      },
      {
        id: "step_4",
        name: "Accommodation Setup",
        description:
          "Arrange accommodation and register with local authorities",
        status: "PENDING",
      },
      {
        id: "step_5",
        name: "Banking & Tax Registration",
        description: "Open bank account and register for tax ID",
        status: "PENDING",
      },
      {
        id: "step_6",
        name: "Workplace Orientation",
        description: "Complete orientation and safety training",
        status: "PENDING",
      },
    ],
  },
  [WorkflowType.VISA_RENEWAL]: {
    type: WorkflowType.VISA_RENEWAL,
    steps: [
      {
        id: "step_1",
        name: "Request Initiation",
        description: "Employee or HR initiates visa renewal request",
        status: "PENDING",
      },
      {
        id: "step_2",
        name: "Document Review",
        description: "HR reviews and verifies required documents",
        status: "PENDING",
      },
      {
        id: "step_3",
        name: "Government Submission",
        description: "Submit application to immigration authority",
        status: "PENDING",
      },
      {
        id: "step_4",
        name: "Processing & Approval",
        description: "Wait for government processing and approval",
        status: "PENDING",
      },
      {
        id: "step_5",
        name: "Visa Issuance",
        description: "Receive and verify visa issuance",
        status: "PENDING",
      },
    ],
  },
  [WorkflowType.LEAVE_REQUEST]: {
    type: WorkflowType.LEAVE_REQUEST,
    steps: [
      {
        id: "step_1",
        name: "Request Submission",
        description: "Employee submits leave request",
        status: "PENDING",
      },
      {
        id: "step_2",
        name: "Department Approval",
        description: "Department head approves request",
        status: "PENDING",
      },
      {
        id: "step_3",
        name: "HR Verification",
        description: "HR verifies leave balance",
        status: "PENDING",
      },
      {
        id: "step_4",
        name: "Final Approval",
        description: "HR manager final approval",
        status: "PENDING",
      },
    ],
  },
  [WorkflowType.CONTRACT_RENEWAL]: {
    type: WorkflowType.CONTRACT_RENEWAL,
    steps: [
      {
        id: "step_1",
        name: "Renewal Notice",
        description: "Send renewal notice to employee",
        status: "PENDING",
      },
      {
        id: "step_2",
        name: "Negotiation",
        description: "Employee and employer negotiate terms",
        status: "PENDING",
      },
      {
        id: "step_3",
        name: "Contract Preparation",
        description: "Prepare new contract with agreed terms",
        status: "PENDING",
      },
      {
        id: "step_4",
        name: "E-Signature",
        description: "Employee signs contract electronically",
        status: "PENDING",
      },
      {
        id: "step_5",
        name: "Verification",
        description: "HR verifies and stores contract",
        status: "PENDING",
      },
    ],
  },
  [WorkflowType.DOCUMENT_SUBMISSION]: {
    type: WorkflowType.DOCUMENT_SUBMISSION,
    steps: [
      {
        id: "step_1",
        name: "Document Upload",
        description: "Employee uploads required documents",
        status: "PENDING",
      },
      {
        id: "step_2",
        name: "Initial Verification",
        description: "Check document completeness and format",
        status: "PENDING",
      },
      {
        id: "step_3",
        name: "Compliance Review",
        description: "Review against compliance requirements",
        status: "PENDING",
      },
      {
        id: "step_4",
        name: "Approval",
        description: "Final approval and archival",
        status: "PENDING",
      },
    ],
  },
  [WorkflowType.REPATRIATION]: {
    type: WorkflowType.REPATRIATION,
    steps: [
      {
        id: "step_1",
        name: "Exit Notice",
        description: "Issue exit notice and initiate repatriation",
        status: "PENDING",
      },
      {
        id: "step_2",
        name: "Exit Permit Application",
        description: "Apply for exit permit if required",
        status: "PENDING",
      },
      {
        id: "step_3",
        name: "Final Settlement",
        description: "Calculate final salary, benefits, and deductions",
        status: "PENDING",
      },
      {
        id: "step_4",
        name: "Knowledge Transfer",
        description: "Conduct knowledge transfer and handover",
        status: "PENDING",
      },
      {
        id: "step_5",
        name: "Departure Clearance",
        description: "Process departure clearance",
        status: "PENDING",
      },
    ],
  },
};

export async function initializeWorkflow(
  type: WorkflowType,
  employeeId: string,
  tenantId: string,
  metadata?: Record<string, any>,
) {
  const definition = WORKFLOW_DEFINITIONS[type];
  if (!definition) {
    throw new Error(`Unknown workflow type: ${type}`);
  }

  return {
    id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    tenantId,
    type,
    status: WorkflowStatus.INITIATED,
    steps: definition.steps,
    metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateWorkflowStep(
  workflowId: string,
  stepId: string,
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED",
  notes?: string,
) {
  return {
    workflowId,
    stepId,
    status,
    notes,
    updatedAt: new Date(),
  };
}

export async function completeWorkflow(
  workflowId: string,
  completedStatus: "COMPLETED" | "REJECTED" | "CANCELLED",
) {
  return {
    workflowId,
    status: completedStatus,
    completedAt: new Date(),
    updatedAt: new Date(),
  };
}
