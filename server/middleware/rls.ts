/**
 * Row-Level Security (RLS) middleware — Task 2
 *
 * Sets PostgreSQL session-local settings consumed by RLS policies:
 *   app.current_tenant_id   → isolates all queries to the requesting tenant
 *   app.current_employee_id → restricts payslip/sensitive data to the employee
 *   app.current_role        → drives column-level masking policies
 *
 * Called inside every guardedProcedure BEFORE any domain query runs.
 * Uses SET LOCAL so the setting is scoped to the current transaction/statement.
 *
 * Requirements: 1.8, 8.1, 20.6, 28.2 — Property 4: Tenant Data Isolation
 */

import type { Context } from "@/server/trpc";
import { prisma } from "@/lib/prisma";

export async function applyRlsContext(ctx: Pick<Context, "tenantId" | "userId" | "userRole" | "session">): Promise<void> {
  const tenantId    = ctx.tenantId    ?? "";
  const employeeId  = ctx.session?.employeeId ?? "";
  const role        = ctx.userRole    ?? "EMPLOYEE";

  // SET LOCAL is transaction-scoped; Prisma uses a connection pool so we use
  // $executeRaw which runs in the current connection context.
  await prisma.$executeRaw`
    SELECT
      set_config('app.current_tenant_id',   ${tenantId},   true),
      set_config('app.current_employee_id', ${employeeId}, true),
      set_config('app.current_role',        ${role},       true)
  `;
}
