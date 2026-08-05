// ── Clean re-exports (no duplicates) ────────────────────────────────────────────
export * from "./accounting";
export * from "./admin";
export * from "./ai";
export * from "./company";
export * from "./compensation";
export * from "./dashboard";
export * from "./employee";
export * from "./employee-relations";
export * from "./ess";
export * from "./fomema";
export * from "./foreign-worker";
export * from "./geolocation";
export * from "./mss";
export * from "./permits";
export * from "./talent-acquisition";
export * from "./zakat";

// ── Termination (before offboarding to avoid dupes) ─────────────────────────────
export { TerminationDashboard, TerminationList, TerminationForm, ExitInterviewForm, ClearanceTasks, FinalSettlement, AssetReturnList, KnowledgeTransfer, AccessRevocation, AlumniProfile, TerminationChecklist, TerminationAI } from "./termination";

// ── Automation (avoids ComplianceDashboard / ISOComplianceChecker / RiskAssessmentTool conflicts) ──
export {
  FlowDesigner,
  AutomationNavigation,
  WorkflowExecutionMonitor,
  AutomationAI,
} from "./automation";
export * from "./automation/canvas";
export * from "./automation/dnd";
export * from "./automation/edge";
export * from "./automation/layout";
export * from "./automation/palette";
export * from "./automation/library";
export * from "./automation/properties";
export * from "./automation/node/AutomationNodes";
export * from "./automation/node/CustomNodes";
export * from "./automation/QMS";
export * from "./automation/sop-workflow";
export * from "./automation/workflows/workflow-engine";

// ── Compliance ─────────────────────────────────────────────────────────────────
export {
  ComplianceAlert,
  ComplianceAuditForm,
  RiskAssess,
  RiskClimate,
  RiskMatrix,
  RiskMatrixView,
  GapAnalysis,
  AuditChecklist,
  AuditCreatePlan,
  AuditGenerate,
  CapaCreate,
  ComplianceCheck,
  ComplianceScore,
  RegulatoryRegister,
  CompliancePolicyList,
  ComplianceTrainingList,
  IncidentReportList,
  ComplianceReportGenerator,
  ComplianceDashboard,
  ISOComplianceChecker,
  RiskAssessmentTool,
  ComplianceAI,
  RegulationForm,
} from "./compliance";
export { ComplianceMonitor } from "./compliance/compliance-monitor";
export type { AuditFormData } from "./compliance/compliance-audit-form";

// ── Documents (avoids LeaveRequestForm / TerminationForm conflicts with ess/termination) ──
export {
  AddWorkerForm,
  AllowanceForm,
  ConsentForm,
  PayrollAdjustmentForm,
  PerformanceReviewForm,
  PermitApplicationForm,
  VisaRenewalForm,
  DocumentDashboard,
  DocumentLibrary,
  DocumentTemplateEditor,
  DocumentGenerator,
  DocumentSigning,
  DocumentVersionHistory,
  DocumentAI,
} from "./documents";

// ── Handbook ───────────────────────────────────────────────────────────────────
export { HandbookDashboard, HandbookAI, HandbookList } from "./handbook";

// ── Industrial Relations ───────────────────────────────────────────────────────
export { IndustrialRelationsAI, IndustrialRelationsForm, CaseForm, CollectiveAgreementForm, HearingForm, UnionForm } from "./industrial-relations";

// ── Integrations (avoids IntegrationForm / IntegrationList conflicts with admin) ──
export { IntegrationDashboard, IntegrationLogs, IntegrationAI } from "./integrations";
// IntegrationForm and IntegrationList exported from ./admin

// ── Other modules with barrel files ───────────────────────────────────────────
export * from "./notifications";
export * from "./offboarding";
export * from "./pdf";
export * from "./performance";
export * from "./scheduling";
export * from "./sop";
export * from "./succession";
export * from "./tabung-haji";
