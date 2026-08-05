// hooks/index.ts

// ─── Client hooks ──────────────────────────────────────────────────────────
export * from "./client/capabilities";
export * from "./client/iso-hooks";
export * from "./client/ms-hooks";
export * from "./client/trpc";
export * from "./client/types";

// ─── AI hooks ──────────────────────────────────────────────────────────────
export { useAiChat } from "./useAiChat";
export { useAI } from "./useAI";
export { useClaudeConfig } from "./useClaudeConfig";
export { useKbChat } from "./useKbChat";
export { useRag } from "./useRag";
export { useSemanticSearch } from "./useSemanticSearch";

// ─── Core/Shared hooks ─────────────────────────────────────────────────────
export { useDebounce } from "./use-debounce";
export { useIsMobile } from "./use-mobile";
export { useToast } from "./use-toast";
export { useTranslation } from "./useTranslation";
export { useLocalizedHref } from "./useLocalizedHref";
export { useFormMutation } from "./useFormMutation";

// ─── Employee / HR ─────────────────────────────────────────────────────────
export { useEmployee } from "./useEmployee";
export { useExpatriates } from "./useExpatriates";
export { useForeignWorker } from "./useForeignWorker";
export { useOffboarding } from "./useOffboarding";
export { useTermination } from "./useTermination";

// ─── Learning & Development ────────────────────────────────────────────────
export { useLearningDev } from "./useLearningDev";

// ─── Industrial Relations ──────────────────────────────────────────────────
export { useIndustrialRelations } from "./useIndustrialRelations";

// ─── Employee Relations ────────────────────────────────────────────────────
export { useEmployeeRelations } from "./useEmployeeRelations";

// ─── Travel & Expense ──────────────────────────────────────────────────────
export { useTravel } from "./useTravel";

// ─── Health & Safety ───────────────────────────────────────────────────────
export { useHealthSafety } from "./useHealthSafety";

// ─── Audit Trail ───────────────────────────────────────────────────────────
export { useAuditTrail } from "./useAuditTrail";

// ─── Data Governance ───────────────────────────────────────────────────────
export { useDataGovernance } from "./useDataGovernance";

// ─── Workforce Planning ────────────────────────────────────────────────────
export { useWorkforcePlanning } from "./useWorkforcePlanning";

// ─── Onboarding ────────────────────────────────────────────────────────────
export { useOnboarding } from "./useOnBoarding";

// ─── Benefits ──────────────────────────────────────────────────────────────
export { useBenefits } from "./useBenefits";

// ─── Compensation & Payroll ────────────────────────────────────────────────
export { useCompensation } from "./useCompensation";
export { usePayroll } from "./usePayroll";

// ─── Workforce Management ──────────────────────────────────────────────────
export { useScheduling } from "./useScheduling";

// ─── Talent & Succession ───────────────────────────────────────────────────
export { useRecruitmentAgent } from "./useRecruitment";
export { useSuccession } from "./useSuccession";

// ─── Compliance & Relations ────────────────────────────────────────────────
export { useComplianceAgent } from "./useCompliance";

// ─── Company & Admin ───────────────────────────────────────────────────────
export { useCompany } from "./useCompany";
export { useAdmin } from "./useAdmin";

// ─── Finance & Zakat ───────────────────────────────────────────────────────
export { useZakat } from "./useZakat";

// ─── Documents & Knowledge ─────────────────────────────────────────────────
export { useDocument } from "./useDocument";

// ─── Automation & Flows ────────────────────────────────────────────────────
export { useAutomation } from "./useAutomation";
export { useFlowOperation } from "./useFlowOperation";
export { useWorkflow } from "./useWorkflow";

// ─── Geolocation ───────────────────────────────────────────────────────────
export { useGeolocation } from "./useGeolocation";

// ─── Integrations ──────────────────────────────────────────────────────────
export { useIntegration } from "./useIntegration";

// ─── Analytics & Dashboard ─────────────────────────────────────────────────
export { useDashboard } from "./useDashboard";
export { useAnalytics } from "./useAnalytics";

// ─── Notifications & Settings ──────────────────────────────────────────────
export { useNotification } from "./useNotification";
export { useSettings } from "./useSettings";

// ─── Flow Designer specific hooks ──────────────────────────────────────────
export { useAutoLayout } from "./useAutoLayout";
export { useNodeOperations } from "./useNodeOperations";
export { useSelection } from "./useSelection";
export { useViewportOperations } from "./useViewportOperations";

// ─── Orchestrator ──────────────────────────────────────────────────────────
export { useHrOrchestrator } from "./useHrOrchestrator";

// ─── Authentication ────────────────────────────────────────────────────────
export { useAuth } from "./useAuth";
export { useSession } from "./useSession";

// ─── Leave ─────────────────────────────────────────────────────────────────
export { useLeave } from "./useLeave";

// ─── URL State ─────────────────────────────────────────────────────────────
export { useSearchParams } from "./useSearchParams";