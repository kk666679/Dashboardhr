/**
 * @deprecated  This file is NOT the active tRPC router.
 *
 * The canonical AppRouter lives in  server/root.ts  and is used by:
 *   - app/api/trpc/[trpc]/route.ts  (server handler)
 *   - lib/trpc.ts                   (client hooks)
 *
 * This file was an early scaffolding router that was superseded.  It still
 * compiles because its routers (server/api/routers/*) are all stubs, but it
 * is intentionally NOT exported from any active code path.
 *
 * DO NOT import AppRouter or appRouter from this file.
 * Use: import type { AppRouter } from "@/server/root"
 */

import { router } from "./trpc";
import { terminationRouter } from "./routers/termination";
import { automationRouter } from "./routers/automation";
import { companyRouter } from "./routers/company";
import { compensationRouter } from "./routers/compensation";
import { schedulingRouter } from "./routers/scheduling";
import { zakatRouter } from "./routers/zakat";
import { foreignWorkerRouter } from "./routers/foreignWorker";
import { documentsRouter } from "./routers/documents";
import { geolocationRouter } from "./routers/geolocation";
import { successionRouter } from "./routers/succession";
import { workflowRouter } from "./routers/workflow";
import { employeeRouter } from "./routers/employee";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { medicalRouter } from "./routers/medical";

export const appRouter = router({
  termination: terminationRouter,
  automation: automationRouter,
  company: companyRouter,
  compensation: compensationRouter,
  scheduling: schedulingRouter,
  zakat: zakatRouter,
  foreignWorker: foreignWorkerRouter,
  documents: documentsRouter,
  geolocation: geolocationRouter,
  succession: successionRouter,
  workflow: workflowRouter,
  employee: employeeRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
  medical: medicalRouter,
});

export type AppRouter = typeof appRouter;
