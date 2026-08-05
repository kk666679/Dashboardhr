// Existing exports (we preserve these)
export { ComplianceAlert } from "./compliance-alert";
export { ComplianceAuditForm } from "./compliance-audit-form";
export type { AuditFormData } from "./compliance-audit-form";
export { ComplianceMonitor } from "./compliance-monitor";
export { RiskAssess } from "./risk-assess";
export { RiskClimate } from "./risk-climate";
export { RiskMatrix } from "./risk-matrix";
export { RiskMatrixView } from "./risk-matrix-view";
export { ISOComplianceChecker } from "./ISOComplianceChecker";
export { RiskAssessmentTool } from "./RiskAssessmentTool";

// ── New compliance exports (consolidated from automation/compliance) ──
export { ComplianceAudit } from "./ComplianceAudit";
export { ComplianceChecklistForm } from "./ComplianceChecklistForm";
export { ComplianceReporting } from "./ComplianceReporting";
export { PolicyList } from "./PolicyList";
export { PolicyForm } from "./PolicyForm";
export { RegulationList } from "./RegulationList";

// ── Dashboard & Regulatory ──
export { ComplianceDashboard } from "./ComplianceDashboard";
export { RegulatoryRegister } from "./RegulatoryRegister";
export { RegulationForm } from "./RegulationForm";
export { CompliancePolicyList } from "./CompliancePolicyList";
export { ComplianceTrainingList } from "./ComplianceTrainingList";
export { IncidentReportList } from "./IncidentReportList";
export { ComplianceReportGenerator } from "./ComplianceReportGenerator";
export { ComplianceAI } from "./ComplianceAI";

// ── ISO components moved to features/iso — re-exports for backward compat ──
export { GapAnalysis } from "../iso/gap-analysis";
export { AuditChecklist } from "../iso/audit-checklist";
export { AuditCreatePlan } from "../iso/audit-create-plan";
export { AuditGenerate } from "../iso/audit-generate";
export { CAPACreate as CapaCreate } from "../iso/capa-create";
export { ComplianceCheck } from "../iso/compliance-check";
export { ComplianceScore } from "../iso/compliance-score";

