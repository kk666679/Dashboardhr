import { AuditEngine } from '@/services/audit-engine';
import { ComplianceScoringEngine } from '@/services/compliance-scoring-engine';
import { ClimateRiskEngine } from '@/services/climate-risk-engine';
import { CorrectiveActionEngine } from '@/services/corrective-action-engine';
import { RiskEngine } from '@/services/risk-engine';
import { MalaysianStandardsService } from '@/services/malaysian-standards';
import { loadAndIndexKnowledgeBase } from '@/services/kb-loader';

export const auditEngine = new AuditEngine();
export const complianceScoringEngine = new ComplianceScoringEngine();
export const climateRiskEngine = new ClimateRiskEngine();
export const correctiveActionEngine = new CorrectiveActionEngine();
export const riskEngine = new RiskEngine();
export const malaysianStandardsEngine = new MalaysianStandardsService();

export { loadAndIndexKnowledgeBase };

export type { AuditEngine };
export type { ComplianceScoringEngine };
export type { ClimateRiskEngine };
export type { CorrectiveActionEngine };
export type { RiskEngine };
export type { MalaysianStandardsService };

export async function initializeServices() {
  return {
    audit: auditEngine,
    compliance: complianceScoringEngine,
    climate: climateRiskEngine,
    corrective: correctiveActionEngine,
    risk: riskEngine,
    standards: malaysianStandardsEngine,
  };
}
