// All types are derived from Zod schemas — do NOT define types manually here.

import type {
  DashboardDataSchema,
  ExpiryStatsSchema,
} from "@/lib/schema";

import type {
  EmployeeRowSchema,
  WorkerSchema,
  WorkerCreateSchema,
  PermitSchema,
  MedicalRecordSchema,
  ComplianceAlertSchema,
  PersonalInfoSchema,
  EmploymentInfoSchema,
  CreateEmployeeSchema,
  EmployeeFiltersSchema,
  CreatePayrollSchema,
  WorkerStatusSchema,
  PermitTypeSchema,
  PermitStatusSchema,
} from "@/lib/schemas";
import type { z } from "zod";

export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type ExpiryStats = z.infer<typeof ExpiryStatsSchema>;
export type EmployeeRow = z.infer<typeof EmployeeRowSchema>;
export type Worker = z.infer<typeof WorkerSchema>;
export type WorkerCreate = z.infer<typeof WorkerCreateSchema>;
export type Permit = z.infer<typeof PermitSchema>;
export type MedicalRecord = z.infer<typeof MedicalRecordSchema>;
export type ComplianceAlert = z.infer<typeof ComplianceAlertSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type EmploymentInfo = z.infer<typeof EmploymentInfoSchema>;
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
export type EmployeeFilters = z.infer<typeof EmployeeFiltersSchema>;
export type CreatePayroll = z.infer<typeof CreatePayrollSchema>;
export type WorkerStatus = z.infer<typeof WorkerStatusSchema>;
export type PermitType = z.infer<typeof PermitTypeSchema>;
export type PermitStatus = z.infer<typeof PermitStatusSchema>;

// Recruitment types (used by useExpat and useRecruitment hooks)
export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
}

export interface CandidateScore {
  technical: number;
  experience: number;
  communication: number;
  cultureFit: number;
  total: number;
  reasoning?: string;
}

export interface RankedCandidate {
  candidateId: string;
  score: CandidateScore;
  rank: number;
  shortlisted: boolean;
  interviewQuestions?: string[];
}

export interface RecruitmentAnalysis {
  rankings: RankedCandidate[];
  summary?: string;
}

// AI / Orchestrator types (not Zod-derivable — streaming contracts)
export type AgentOutput = { type: string; message: string; source?: string };
export type HRAgentResult = { raw: AgentOutput[]; final: string };
