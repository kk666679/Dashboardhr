// Succession components — organized in subdirectories
export { BenchDashboard as SuccessionDashboard } from "./BenchStrength/BenchDashboard";
export { PipelineSnapshot } from "./BenchStrength/PipelineSnapshot";
export { BenchAI } from "./BenchStrength/BenchAI";

export { PositionForm as SuccessionPlanForm } from "./CriticalPositions/PositionForm";
export { PositionList as SuccessionPlanList, PositionList as CriticalPositionList } from "./CriticalPositions/PositionList";
export { PositionAI } from "./CriticalPositions/PositionAI";

export { DevPlanForm as DevelopmentPlanForm } from "./DevelopmentPlans/DevPlanForm";
export { DevPlanList } from "./DevelopmentPlans/DevPlanList";
export { DevPlanTaskList } from "./DevelopmentPlans/DevPlanTaskList";
export { DevPlanAI } from "./DevelopmentPlans/DevPlanAI";

export { NineBoxMatrix as NineBoxGrid } from "./NineBox/NineBoxMatrix";
export { NineBoxAssessmentForm } from "./NineBox/NineBoxAssessmentForm";
export { NineBoxAI } from "./NineBox/NineBoxAI";

export { ReadinessAssessmentForm as ReadinessLevel } from "./Readiness/ReadinessAssessmentForm";
export { ReadinessHistory } from "./Readiness/ReadinessHistory";
export { ReadinessAI } from "./Readiness/ReadinessAI";

export { SuccessorRanking as SuccessorCard } from "./Successors/SuccessorRanking";
export { SuccessorAssignmentList } from "./Successors/SuccessorAssignmentList";
export { SuccessorAI } from "./Successors/SuccessorAI";
