import { z } from 'zod';

// ISO Standards
export const ISOStandard = z.enum(['ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO27001']);
export type ISOStandard = z.infer<typeof ISOStandard>;

// Compliance Types
export const ComplianceStatus = z.enum(['compliant', 'partial', 'non-compliant', 'not-applicable']);
export type ComplianceStatus = z.infer<typeof ComplianceStatus>;

export const ComplianceFindingSchema = z.object({
  clause: z.string(),
  status: ComplianceStatus,
  weight: z.number().optional(),
});
export type ComplianceFinding = z.infer<typeof ComplianceFindingSchema>;

export const ComplianceCheckResultSchema = z.object({
  findings: z.array(ComplianceFindingSchema),
  compliantCount: z.number(),
  nonCompliantCount: z.number(),
  partialCount: z.number(),
  notApplicableCount: z.number(),
  overallScore: z.number(),
});
export type ComplianceCheckResult = z.infer<typeof ComplianceCheckResultSchema>;

export const ComplianceScoreSchema = z.object({
  overallScore: z.number(),
  complianceRate: z.number(),
  totalClauses: z.number(),
  compliantClauses: z.number(),
  nonCompliantClauses: z.number(),
  partialClauses: z.number(),
  grade: z.enum(['A', 'B', 'C', 'D', 'F']),
});
export type ComplianceScore = z.infer<typeof ComplianceScoreSchema>;

export const GapAnalysisSchema = z.object({
  standard: ISOStandard,
  totalGaps: z.number(),
  criticalGaps: z.number(),
  gaps: z.array(z.object({
    clause: z.string(),
    currentStatus: ComplianceStatus,
    gap: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    recommendations: z.array(z.string()),
    estimatedEffort: z.enum(['low', 'medium', 'high']),
  })),
  summary: z.string(),
  actionPlan: z.array(z.object({
    clause: z.string(),
    action: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    owner: z.string(),
    dueDate: z.date().nullable(),
  })),
});
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;

// Audit Types
export const AuditTypeSchema = z.enum(['internal', 'external', 'surveillance', 'certification']);
export type AuditType = z.infer<typeof AuditTypeSchema>;

export const AuditChecklistSchema = z.object({
  id: z.string(),
  standard: ISOStandard,
  scope: z.string(),
  auditType: AuditTypeSchema,
  checklist: z.array(z.any()),
  estimatedDuration: z.string(),
  createdAt: z.date(),
});
export type AuditChecklist = z.infer<typeof AuditChecklistSchema>;

export const AuditPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  standard: ISOStandard,
  scope: z.string(),
  objectives: z.array(z.string()),
  startDate: z.date(),
  endDate: z.date(),
  auditors: z.array(z.string()),
  auditees: z.array(z.string()),
  clauses: z.array(z.string()).optional(),
  status: z.enum(['draft', 'approved', 'in-progress', 'completed']),
  schedule: z.array(z.any()),
  resources: z.array(z.any()),
  createdAt: z.date(),
});
export type AuditPlan = z.infer<typeof AuditPlanSchema>;

// Risk Types
export const RiskCategorySchema = z.enum(['quality', 'environmental', 'safety', 'security', 'operational', 'strategic']);
export type RiskCategory = z.infer<typeof RiskCategorySchema>;

export const LikelihoodSchema = z.enum(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']);
export type Likelihood = z.infer<typeof LikelihoodSchema>;

export const ConsequenceSchema = z.enum(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']);
export type Consequence = z.infer<typeof ConsequenceSchema>;

export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'extreme']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const RiskAssessmentSchema = z.object({
  id: z.string(),
  description: z.string(),
  category: RiskCategorySchema,
  likelihood: LikelihoodSchema,
  consequence: ConsequenceSchema,
  riskScore: z.number(),
  riskLevel: RiskLevelSchema,
  requiresAction: z.boolean(),
  recommendations: z.array(z.string()),
  residualRisk: z.any().nullable(),
  assessedAt: z.date(),
});
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;

export const RiskMatrixSchema = z.object({
  matrix: z.array(z.object({
    id: z.string(),
    description: z.string(),
    likelihood: LikelihoodSchema,
    consequence: ConsequenceSchema,
    likelihoodScore: z.number(),
    consequenceScore: z.number(),
    riskScore: z.number(),
    riskLevel: RiskLevelSchema,
  })),
  summary: z.object({
    total: z.number(),
    extreme: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
  }),
});
export type RiskMatrix = z.infer<typeof RiskMatrixSchema>;

export const ClimateHazardSchema = z.enum([
  'extreme-heat', 'flooding', 'drought', 'storms', 'sea-level-rise',
  'wildfires', 'cold-waves', 'precipitation-changes'
]);
export type ClimateHazard = z.infer<typeof ClimateHazardSchema>;

export const ClimateRiskAssessmentSchema = z.object({
  organizationContext: z.string(),
  location: z.string().optional(),
  timeHorizon: z.enum(['short-term', 'medium-term', 'long-term']),
  identifiedRisks: z.array(z.object({
    id: z.string(),
    hazard: ClimateHazardSchema,
    description: z.string(),
    likelihood: LikelihoodSchema,
    consequence: ConsequenceSchema,
    adaptationMeasures: z.array(z.string()),
    monitoringPlan: z.string(),
  })),
  opportunities: z.array(z.any()),
  adaptationPlan: z.object({
    measures: z.array(z.string()),
    timeline: z.string(),
    responsibilities: z.array(z.string()),
  }),
  iso14001Compliance: z.boolean(),
  assessedAt: z.date(),
});
export type ClimateRiskAssessment = z.infer<typeof ClimateRiskAssessmentSchema>;

// CAPA Types
export const CAPATypeSchema = z.enum(['corrective', 'preventive']);
export type CAPAType = z.infer<typeof CAPATypeSchema>;

export const CAPASourceSchema = z.enum(['audit', 'complaint', 'nonconformity', 'risk', 'improvement']);
export type CAPASource = z.infer<typeof CAPASourceSchema>;

export const CAPAPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export type CAPAPriority = z.infer<typeof CAPAPrioritySchema>;

export const CAPASchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: CAPATypeSchema,
  source: CAPASourceSchema,
  rootCause: z.string().optional(),
  proposedAction: z.string(),
  owner: z.string(),
  dueDate: z.date(),
  priority: CAPAPrioritySchema,
  status: z.enum(['open', 'in-progress', 'completed', 'verified', 'closed']),
  effectiveness: z.any().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  closedAt: z.date().nullable(),
});
export type CAPA = z.infer<typeof CAPASchema>;

export const FiveWhysSchema = z.object({
  problem: z.string(),
  whys: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  rootCause: z.string(),
  recommendations: z.array(z.string()),
  createdAt: z.date(),
});
export type FiveWhys = z.infer<typeof FiveWhysSchema>;

export const FishboneCategorySchema = z.enum(['people', 'process', 'equipment', 'materials', 'environment', 'management']);
export type FishboneCategory = z.infer<typeof FishboneCategorySchema>;

export const FishboneSchema = z.object({
  problem: z.string(),
  categories: z.array(z.object({
    name: FishboneCategorySchema,
    causes: z.array(z.string()),
  })),
  rootCauses: z.array(z.string()),
  recommendations: z.array(z.string()),
  createdAt: z.date(),
});
export type Fishbone = z.infer<typeof FishboneSchema>;
