/**
 * Row-Level Security middleware for tRPC.
 *
 * Sets the PostgreSQL session variables `app.tenant_id` and `app.user_id`
 * so that any RLS policies defined on tables can filter rows automatically.
 *
 * Usage: attach to `guardedProcedure` so every tenant-scoped procedure
 * runs inside a connection where the RLS context is set.
 */

import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import type { Context } from "@/server/trpc";

type TxClient = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export async function withRlsContext<T>(
  ctx: Context,
  fn: (tx: TxClient) => Promise<T>
): Promise<T> {
  if (!ctx.tenantId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing tenant context" });
  }

  return prisma.$transaction(async (tx) => {
    await (tx as any).$executeRaw(
      `SELECT set_config('app.tenant_id', $1, true), set_config('app.user_id', $2, true)`,
      ctx.tenantId,
      ctx.userId ?? ""
    );
    return fn(tx as TxClient);
  });
}

/** tRPC middleware that injects RLS session variables before the procedure runs. */
export function rlsMiddleware({ ctx, next }: { ctx: Context; next: () => Promise<any> }) {
  if (!ctx.tenantId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return prisma.$transaction(async (tx) => {
    await (tx as any).$executeRaw(
      `SELECT set_config('app.tenant_id', $1, true), set_config('app.user_id', $2, true)`,
      ctx.tenantId,
      ctx.userId ?? ""
    );
    return next();
  });
}
