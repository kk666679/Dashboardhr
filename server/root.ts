import { router } from "./trpc";

import { authRouter }         from "@/server/routers/auth";
import { agentRouter }        from "@/server/routers/agent";
import { documentRouter }     from "@/server/routers/document";
import { isoRouter }          from "@/server/routers/iso";
import { msRouter }           from "@/server/routers/ms";
import { dashboardRouter }    from "@/server/routers/dashboard";
import { employeeRouter }     from "@/server/routers/employee";
import { expatriateRouter }   from "@/server/routers/expatriate";
import { complianceRouter }   from "@/server/routers/compliance";
import { payrollRouter }      from "@/server/routers/payroll";
import { searchRouter }       from "@/server/routers/search";
import { accountingRouter }   from "@/server/routers/accounting";
import { leaveRouter }        from "@/server/routers/leave";
import { visaRouter }         from "@/server/routers/visa";
import { notificationsRouter } from "@/server/routers/notifications";
import { performanceRouter }  from "@/server/routers/performance";
import { terminationRouter }  from "@/server/routers/termination";
import { recruitmentRouter }  from "@/server/routers/recruitment";
import { organisationRouter } from "@/server/routers/organisation";
import { sopRouter }          from "@/server/routers/sop";
import { claimsRouter }       from "@/server/routers/claims";
import { lmsRouter }          from "@/server/routers/lms";
import { assetsRouter }       from "@/server/routers/assets";
import { workflowEngineRouter } from "@/server/routers/workflowEngine";
import { attendanceRouter }   from "@/server/routers/attendance";
import { analyticsRouter }    from "@/server/routers/analytics";
import { payrollHcmRouter }   from "@/server/routers/payrollHcm";
import { statutoryRouter }    from "@/server/routers/statutory";
import { aiRouter }           from "@/server/routers/ai";
import { zakatRouter }        from "@/server/routers/zakat";
import { lifecycleRouter }    from "@/server/routers/lifecycle";
import { onboardingRouter }   from "@/server/routers/onboarding";
import { notificationCenterRouter } from "@/server/routers/notificationCenter";
import { benefitsRouter }     from "@/server/routers/benefits";
import { successionRouter }   from "@/server/routers/succession";
import { compensationRouter } from "@/server/routers/compensation";
import { essRouter }          from "@/server/routers/ess";
import { mssRouter }          from "@/server/routers/mss";
import { travelRouter }       from "@/server/routers/travel";
import { healthSafetyRouter } from "@/server/routers/healthSafety";
import { dataGovernanceRouter } from "@/server/routers/dataGovernance";
import { workforcePlanningRouter } from "@/server/routers/workforcePlanning";
import { integrationsRouter } from "@/server/routers/integrations";
import { securityRouter }     from "@/server/routers/security";
import { auditTrailRouter }   from "@/server/routers/auditTrail";
import { shiftsRouter }       from "@/server/routers/shifts";
import { positionsRouter }    from "@/server/routers/positions";
import { qmsRouter }          from "@/server/routers/qms";
import { clearanceRouter, assetReturnRouter, exitInterviewRouter, knowledgeTransferRouter, settlementRouter, revocationRouter } from "@/server/routers/offboarding";
import { shiftPatternRouter, rotationRouter, swapRouter } from "@/server/routers/scheduling";
import { employeeRelationsRouter }  from "@/server/routers/employeeRelations";
import { fomemaRouter }             from "@/server/routers/fomema";
import { industrialRelationsRouter } from "@/server/routers/industrialRelations";
import { bonusPlanRouter, compensationCycleRouter, equityDefinitionRouter, equityGrantRouter, incentivePlanRouter, meritRouter, variablePayRouter } from "@/server/routers/compensationPlans";
import { criticalPositionRouter, devPlanRouter, nineBoxRouter, readinessRouter, successorRouter } from "@/server/routers/successionPlanning";
import { learningRouter }       from "@/server/routers/learningDev";
import { handbookRouter }       from "@/server/routers/handbookRouter";
import { companyRouter }        from "@/server/routers/companyRouters";
import { foreignWorkerRouter }  from "@/server/routers/foreignWorkerRouter";
import { automationRouter }     from "@/server/routers/automation";
import { opexRouter }           from "@/server/routers/opex";
import { capexRouter }          from "@/server/routers/capex";
import { adminRouter }          from "@/server/api/routers/admin";
import { accommodationRouter } from "@/server/routers/accommodation";
import { medicalRouter } from "@/server/routers/medical";
import { geolocationRouter } from "@/server/api/routers/geolocation";
import { featureFlagsRouter } from "@/server/routers/featureFlags";

export const appRouter = router({
  auth:             authRouter,
  agent:            agentRouter,
  document:         documentRouter,
  iso:              isoRouter,
  ms:               msRouter,
  dashboard:        dashboardRouter,
  employee:         employeeRouter,
  expatriate:       expatriateRouter,
  compliance:       complianceRouter,
  payroll:          payrollRouter,
  search:           searchRouter,
  accounting:       accountingRouter,
  leave:            leaveRouter,
  visa:             visaRouter,
  notifications:    notificationsRouter,
  performance:      performanceRouter,
  termination:      terminationRouter,
  recruitment:      recruitmentRouter,
  organisation:     organisationRouter,
  sop:              sopRouter,
  claims:           claimsRouter,
  lms:              lmsRouter,
  assets:           assetsRouter,
  workflowEngine:   workflowEngineRouter,
  attendance:       attendanceRouter,
  analytics:        analyticsRouter,
  payrollHcm:       payrollHcmRouter,
  statutory:        statutoryRouter,
  ai:               aiRouter,
  zakat:            zakatRouter,
  lifecycle:        lifecycleRouter,
  onboarding:       onboardingRouter,
  notificationCenter: notificationCenterRouter,
  benefits:         benefitsRouter,
  succession:       successionRouter,
  compensation:     compensationRouter,
  ess:              essRouter,
  mss:              mssRouter,
  travel:           travelRouter,
  healthSafety:     healthSafetyRouter,
  dataGovernance:   dataGovernanceRouter,
  workforcePlanning: workforcePlanningRouter,
  integrations:     integrationsRouter,
  security:         securityRouter,
  auditTrail:       auditTrailRouter,
  shifts:           shiftsRouter,
  positions:        positionsRouter,
  qms:              qmsRouter,
  clearance:        clearanceRouter,
  assetReturn:      assetReturnRouter,
  exitInterview:    exitInterviewRouter,
  knowledgeTransfer: knowledgeTransferRouter,
  settlement:       settlementRouter,
  revocation:       revocationRouter,
  shiftPattern:     shiftPatternRouter,
  rotation:         rotationRouter,
  swap:             swapRouter,
  er:               employeeRelationsRouter,
  fomema:           fomemaRouter,
  industrialRelations: industrialRelationsRouter,
  bonusPlan:        bonusPlanRouter,
  compensationCycle: compensationCycleRouter,
  equityDefinition: equityDefinitionRouter,
  equityGrant:      equityGrantRouter,
  incentivePlan:    incentivePlanRouter,
  merit:            meritRouter,
  variablePay:      variablePayRouter,
  criticalPosition: criticalPositionRouter,
  devPlan:          devPlanRouter,
  nineBox:          nineBoxRouter,
  readiness:        readinessRouter,
  successor:        successorRouter,
  learning:         learningRouter,
  handbook:         handbookRouter,
  company:          companyRouter,
  foreignWorker:    foreignWorkerRouter,
  automation:       automationRouter,
  permits:          visaRouter,
  admin:            adminRouter,
  accommodation:    accommodationRouter,
  medical:          medicalRouter,
  geolocation:      geolocationRouter,
  opex:             opexRouter,
  capex:            capexRouter,
  featureFlags:     featureFlagsRouter,
});

export type AppRouter = typeof appRouter;
