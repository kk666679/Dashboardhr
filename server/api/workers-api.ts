/**
 * @deprecated Prefer the tRPC routers in `server/api` and feature hooks in `hooks/`.
 * This file is kept as a compatibility shim so legacy imports do not duplicate
 * worker API logic or break the build.
 */

import type { z } from "zod";
import { WorkerCreateSchema } from "@/lib/schemas";

export type WorkerCreateInput = z.infer<typeof WorkerCreateSchema>;
export { WorkerCreateSchema };

export {
  fwmsApi as workersApi,
  useGetWorkerByIdQuery,
  useGetWorkersQuery,
  useCreateWorkerMutation,
  useUpdateWorkerMutation,
  useDeleteWorkerMutation,
  useGetWorkerAnalyticsQuery as useGetWorkerStatsQuery,
} from "@/server/api/fwms-api";
