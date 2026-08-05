import { appRouter } from "@/server/root";
import { createContext } from "@/server/trpc";

/**
 * Call tRPC procedures directly from Server Components — no HTTP, no serialisation overhead.
 *
 * @example
 * ```ts
 * // app/dashboard/page.tsx (Server Component)
 * import { serverCaller } from '@/lib/trpc-server'
 *
 * export default async function Page() {
 *   const caller = await serverCaller()
 *   const data = await caller.dashboard.getData()
 *   return <Dashboard data={data} />
 * }
 * ```
 */
export async function serverCaller() {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
}
