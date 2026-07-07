import { router } from "./trpc";
import { complianceRouter } from "@/server/routers/compliance";
import { dashboardRouter } from "@/server/routers/dashboard";
import { employeeRouter } from "@/server/routers/employee";
import { expatriateRouter } from "@/server/routers/expatriate";
import { payrollRouter } from "@/server/routers/payroll";
import { searchRouter } from "@/server/routers/search";
import { accountingRouter } from "@/server/routers/accounting";
import { leaveRouter } from "@/server/routers/leave";
import { visaRouter } from "@/server/routers/visa";
import { notificationsRouter } from "@/server/routers/notifications";
import { agentRouter } from "@/server/routers/agent";
import { documentRouter } from "@/server/routers/document";
import { isoRouter } from "@/server/routers/iso";
import { msRouter } from "@/server/routers/ms";
import { performanceRouter } from "@/server/routers/performance";
import { terminationRouter } from "@/server/routers/termination";
import { recruitmentRouter } from "@/server/routers/recruitment";
import { organisationRouter } from "@/server/routers/organisation";
import { sopRouter } from "@/server/routers/sop";
import { claimsRouter } from "@/server/routers/claims";
import { lmsRouter } from "@/server/routers/lms";
import { assetsRouter } from "@/server/routers/assets";
import { workflowEngineRouter } from "@/server/routers/workflowEngine";
import { attendanceRouter } from "@/server/routers/attendance";
import { analyticsRouter } from "@/server/routers/analytics";
import { onboardingRouter } from "@/server/routers/onboarding";
import { payrollHcmRouter } from "@/server/routers/payrollHcm";
import { statutoryRouter } from "@/server/routers/statutory";
import { aiRouter } from "@/server/routers/ai";


export const appRouter = router({


  agent: agentRouter,
  document: documentRouter,
  iso: isoRouter,
  ms: msRouter,
  dashboard: dashboardRouter,
  employee: employeeRouter,
  expatriate: expatriateRouter,
  compliance: complianceRouter,
  payroll: payrollRouter,
  search: searchRouter,
  accounting: accountingRouter,
  leave: leaveRouter,
  visa: visaRouter,
  notifications: notificationsRouter,
  performance: performanceRouter,
  termination: terminationRouter,
  recruitment: recruitmentRouter,
  organisation: organisationRouter,
  sop: sopRouter,
  claims: claimsRouter,
  lms: lmsRouter,
  assets: assetsRouter,
  workflowEngine: workflowEngineRouter,
  attendance: attendanceRouter,
  analytics: analyticsRouter,
  onboarding: onboardingRouter,
  payrollHcm: payrollHcmRouter,
  statutory: statutoryRouter,
  ai: aiRouter,
});




export type AppRouter = typeof appRouter;
