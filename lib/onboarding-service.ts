import { prisma } from "@/lib/prisma";

export enum OnboardingStage {
  PRE_ARRIVAL = "PRE_ARRIVAL",
  DOCUMENTATION = "DOCUMENTATION",
  CUSTOMS_CLEARANCE = "CUSTOMS_CLEARANCE",
  ACCOMMODATION = "ACCOMMODATION",
  BANKING = "BANKING",
  TAX_REGISTRATION = "TAX_REGISTRATION",
  RESIDENCE_PERMIT = "RESIDENCE_PERMIT",
  WORKPLACE_ORIENTATION = "WORKPLACE_ORIENTATION",
  COMPLETED = "COMPLETED",
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  tenantId: string;
  stage: OnboardingStage;
  description: string;
  dueDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createOnboardingChecklist(
  employeeId: string,
  tenantId: string,
) {
  const stages = [
    {
      stage: OnboardingStage.PRE_ARRIVAL,
      description: "Prepare pre-arrival documents (offer letter, employment contract)",
    },
    {
      stage: OnboardingStage.DOCUMENTATION,
      description: "Collect passport, visa, medical examination",
    },
    {
      stage: OnboardingStage.CUSTOMS_CLEARANCE,
      description: "Complete customs entry procedures",
    },
    {
      stage: OnboardingStage.ACCOMMODATION,
      description: "Arrange accommodation and register with local authorities",
    },
    { stage: OnboardingStage.BANKING, description: "Open local bank account" },
    {
      stage: OnboardingStage.TAX_REGISTRATION,
      description: "Register for tax identification number",
    },
    {
      stage: OnboardingStage.RESIDENCE_PERMIT,
      description: "Apply for residence permit",
    },
    {
      stage: OnboardingStage.WORKPLACE_ORIENTATION,
      description: "Complete workplace orientation and safety training",
    },
  ];

  return {
    employeeId,
    tenantId,
    stages: stages.map((s) => ({
      stage: s.stage,
      description: s.description,
      status: "PENDING",
    })),
  };
}

export async function updateOnboardingTask(
  employeeId: string,
  stage: OnboardingStage,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED",
  notes?: string,
) {
  // TODO: Implement task tracking in separate OnboardingTask table once schema is extended
  return {
    employeeId,
    stage,
    status,
    notes,
    updatedAt: new Date(),
  };
}

export async function getOnboardingProgress(
  employeeId: string,
  tenantId: string,
) {
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, tenantId },
    include: {
      contracts: true,
      visas: true,
      documents: true,
    },
  });

  if (!employee) {
    return null;
  }

  const progressStages = [
    {
      stage: OnboardingStage.PRE_ARRIVAL,
      completed: !!(employee.contracts as any[]).find((c: any) => c.startDate <= new Date()),
      percentage: 25,
    },
    {
      stage: OnboardingStage.DOCUMENTATION,
      completed: employee.documents.length > 0,
      percentage: 50,
    },
    {
      stage: OnboardingStage.ACCOMMODATION,
      completed: !!(employee as any).address,
      percentage: 75,
    },
    {
      stage: OnboardingStage.WORKPLACE_ORIENTATION,
      completed: true,
      percentage: 100,
    },
  ];

  const totalCompleted = progressStages.filter((s) => s.completed).length;
  const overallProgress = Math.round(
    (totalCompleted / progressStages.length) * 100,
  );

  return {
    employee,
    stages: progressStages,
    overallProgress,
    lastUpdated: new Date(),
  };
}
