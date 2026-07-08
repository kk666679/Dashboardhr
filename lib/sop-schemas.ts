import { z } from "zod";

export const SopStructureSchema = z.object({
  // 1..19 sections (requested structure)
  documentInformation: z.object({
    code: z.string().min(1),
    title: z.string().min(1),
    department: z.string().min(1),
    category: z.string().min(1),
    version: z.number().int().nonnegative(),
    status: z.string().min(1),
  }),

  purpose: z.string().min(1),
  scope: z.string().min(1),
  definitions: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),

  responsibilities: z.array(
    z.object({
      role: z.string().min(1),
      owner: z.string().min(1).optional(),
      responsibilities: z.array(z.string()).default([]),
    }),
  ),

  processFlow: z.array(
    z.object({
      step: z.string().min(1),
      description: z.string().min(1),
      inputs: z.array(z.string()).default([]),
      outputs: z.array(z.string()).default([]),
      sla: z.string().optional(),
      tools: z.array(z.string()).default([]),
    }),
  ),

  detailedProcedures: z.array(
    z.object({
      procedureTitle: z.string().min(1),
      procedureSteps: z.array(z.string()).min(1),
      evidenceRequired: z.array(z.string()).default([]),
    }),
  ),

  decisionMatrix: z.array(
    z.object({
      decisionPoint: z.string().min(1),
      criteria: z.array(z.string()).default([]),
      outcome: z.string().min(1),
    }),
  ),

  escalationMatrix: z.array(
    z.object({
      trigger: z.string().min(1),
      severity: z.string().min(1),
      escalationTo: z.array(z.string()).default([]),
      timeframe: z.string().optional(),
    }),
  ),

  sla: z.object({
    responseTime: z.string().optional(),
    turnaroundTime: z.string().optional(),
    approvalCycle: z.string().optional(),
    notes: z.string().optional(),
  }),

  complianceRequirements: z.array(
    z.object({
      requirement: z.string().min(1),
      regulation: z.string().optional(),
      control: z.string().optional(),
      evidence: z.array(z.string()).default([]),
      status: z.string().optional(),
    }),
  ),

  riskControls: z.array(
    z.object({
      risk: z.string().min(1),
      likelihood: z.string().optional(),
      impact: z.string().optional(),
      mitigation: z.string().optional(),
      controlOwner: z.string().optional(),
    }),
  ),

  auditCheckpoints: z.array(
    z.object({
      checkpoint: z.string().min(1),
      evidence: z.array(z.string()).default([]),
      retention: z.string().optional(),
    }),
  ),

  requiredForms: z.array(z.string()).default([]),

  kpiMonitoring: z.array(
    z.object({
      kpi: z.string().min(1),
      metric: z.string().optional(),
      target: z.string().optional(),
      frequency: z.string().optional(),
    }),
  ),

  exceptionHandling: z.array(
    z.object({
      exception: z.string().min(1),
      handlingSteps: z.array(z.string()).min(1),
      approver: z.string().optional(),
      evidenceRequired: z.array(z.string()).default([]),
    }),
  ),

  versionHistory: z.array(
    z.object({
      version: z.number().int().nonnegative(),
      changes: z.string(),
      approvedBy: z.string().optional(),
      approvedAt: z.string().optional(),
    }),
  ),

  approvals: z.array(
    z.object({
      approverRole: z.string().min(1),
      required: z.boolean().default(true),
      order: z.number().int().nonnegative().optional(),
    }),
  ),
});

export type SopStructure = z.infer<typeof SopStructureSchema>;

export const SopGenerationInputSchema = z.object({
  department: z.string().min(1),
  category: z.string().min(1),
  processDescription: z.string().min(1),

  // SOP creation sources (all optional)
  prompt: z.string().optional(),
  policyText: z.string().optional(),
  regulationText: z.string().optional(),
  meetingNotes: z.string().optional(),
  processMap: z.string().optional(),
  extractedPdfText: z.string().optional(),

  code: z.string().optional(),
  title: z.string().optional(),
  companyContext: z.record(z.string(), z.any()).optional(),
});

export type SopGenerationInput = z.infer<typeof SopGenerationInputSchema>;

export const SopGenerationOutputSchema = z.object({
  sopCode: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1),
  category: z.string().min(1),
  version: z.number().int().nonnegative(),
  status: z.string().min(1),
  structure: SopStructureSchema,
  artifacts: z.object({
    mermaid: z.string().optional(),
    markdown: z.string().optional(),
    html: z.string().optional(),
  }),
  agentFindings: z.object({
    complianceScore: z.number().int().min(0).max(100).optional(),
    riskScore: z.number().int().min(0).max(100).optional(),
    auditReadinessScore: z.number().int().min(0).max(100).optional(),
    issues: z.array(z.string()).default([]),
  }),
});

export type SopGenerationOutput = z.infer<typeof SopGenerationOutputSchema>;

