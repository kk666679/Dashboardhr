import { trpc } from './trpc';
import type {
  ISOStandard,
  ComplianceStatus,
  AuditType,
  RiskCategory,
  Likelihood,
  Consequence,
  ClimateHazard,
  CAPAType,
  CAPASource,
  CAPAPriority,
} from '@/types/iso';

// Compliance Hooks
export function useComplianceCheck() {
  return trpc.iso.compliance.check.useQuery;
}

export function useComplianceScore() {
  return trpc.iso.compliance.score.useMutation();
}

export function useGapAnalysis() {
  return trpc.iso.compliance.gapAnalysis.useMutation();
}

// Audit Hooks
export function useGenerateAuditChecklist() {
  return trpc.iso.audit.generate.useMutation();
}

export function useCreateAuditPlan() {
  return trpc.iso.audit.createPlan.useMutation();
}

// Risk Hooks
export function useRiskAssessment() {
  return trpc.iso.risk.assess.useMutation();
}

export function useRiskMatrix() {
  return trpc.iso.risk.matrix.useQuery;
}

export function useClimateRiskAssessment() {
  return trpc.iso.risk.climate.useMutation();
}

// CAPA Hooks
export function useCreateCAPA() {
  return trpc.iso.capa.create.useMutation();
}

export function useFiveWhys() {
  return trpc.iso.capa.fiveWhys.useMutation();
}

export function useFishbone() {
  return trpc.iso.capa.fishbone.useMutation();
}

// Combined hook for all ISO operations
export function useISO() {
  return {
    compliance: {
      check: useComplianceCheck(),
      score: useComplianceScore(),
      gapAnalysis: useGapAnalysis(),
    },
    audit: {
      generate: useGenerateAuditChecklist(),
      createPlan: useCreateAuditPlan(),
    },
    risk: {
      assess: useRiskAssessment(),
      matrix: useRiskMatrix(),
      climate: useClimateRiskAssessment(),
    },
    capa: {
      create: useCreateCAPA(),
      fiveWhys: useFiveWhys(),
      fishbone: useFishbone(),
    },
  };
}

// Type exports ...
