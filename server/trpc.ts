import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getCurrentSession } from "@/lib/server/auth";
import { evaluatePolicy } from "@/lib/security/abac";
import { applyRlsContext } from "@/server/middleware/rls";

import type { SessionPayload } from "@/lib/session";

/**
 * tRPC context shape.
 * All procedures receive this object.
 *
 * - tenantId, userId, userRole are always present (fallback to empty strings / "EMPLOYEE" if no session).
 * - session is optional and contains additional attributes (employeeId, legalEntityId, etc.)
 */
export interface Context {
  tenantId: string;
  userId: string;
  userRole: "ADMIN" | "HR" | "EMPLOYEE" | string;
  session?: Pick<SessionPayload, "employeeId" | "legalEntityId" | "departments" | "legalEntities" | "mfaVerified">;
}

/**
 * Builds the tRPC context from the Redis‑backed session.
 * If session is missing, returns minimal context.
 */
export async function createContext(): Promise<Context> {
  const session = await getCurrentSession();
  if (!session) {
    return { tenantId: "", userId: "", userRole: "EMPLOYEE" };
  }

  return {
    tenantId:  session.tenantId,
    userId:    session.userId,
    userRole:  session.role,
    session: {
      ...(session.employeeId    !== undefined && { employeeId:    session.employeeId }),
      ...(session.legalEntityId !== undefined && { legalEntityId: session.legalEntityId }),
      ...(session.departments   !== undefined && { departments:   session.departments }),
      ...(session.legalEntities !== undefined && { legalEntities: session.legalEntities }),
      ...(session.mfaVerified   !== undefined && { mfaVerified:   session.mfaVerified }),
    },
  };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause
            : null,
      },
    };
  },
});

export const router            = t.router;
export const publicProcedure   = t.procedure;
export const createTRPCRouter  = router;

// ─── Protected — requires an authenticated session ──────────────────────────
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  return next({ ctx });
});

// ─── Guarded — requires tenant context and applies RLS ──────────────────────
export const guardedProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.tenantId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Tenant context missing",
    });
  }

  // Apply PostgreSQL Row‑Level Security settings
  try {
    const rlsBase = {
      tenantId: ctx.tenantId,
      userId:   ctx.userId,
      userRole: ctx.userRole,
    };

    const rlsInput = ctx.session === undefined
      ? rlsBase
      : { ...rlsBase, session: ctx.session };

    await applyRlsContext(rlsInput);
  } catch (err) {
    // Non‑fatal in development if DB is unavailable; crash in production
    if (process.env.NODE_ENV === "production") {
      console.error("[RLS] Failed to apply context:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to set row‑level security context",
      });
    }
    // In development, log and continue (allows debugging without DB)
    console.warn("[RLS] Context not applied (dev mode):", err);
  }

  return next({ ctx });
});

// ─── ABAC‑aware procedure factory ────────────────────────────────────────────
/**
 * Creates a procedure that enforces Attribute‑Based Access Control.
 *
 * @param module   – the resource module (e.g., "payroll", "employee")
 * @param action   – the action to check (read, write, delete, approve)
 *
 * Usage:
 *   abacProcedure("payroll", "read")
 *   abacProcedure("employee", "write")
 *
 * Requirements: 15.2, 28.1, 28.2 — Property 8: Permission Monotonicity
 */
export function abacProcedure(
  module: string,
  action: "read" | "write" | "delete" | "approve"
) {
  return guardedProcedure.use(({ ctx, next }) => {
    const result = evaluatePolicy({
      user: {
        id:       ctx.userId,
        role:     ctx.userRole,
        tenantId: ctx.tenantId,
        ...(ctx.session?.departments   && { departments:   ctx.session.departments }),
        ...(ctx.session?.legalEntities && { legalEntities: ctx.session.legalEntities }),
        ...(ctx.session?.employeeId    && { employeeId:    ctx.session.employeeId }),
      },
      resource: {
        tenantId: ctx.tenantId,
        module,
      },
      action,
    });

    if (!result.allowed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: result.reason ?? `Access denied to ${module}:${action}`,
      });
    }

    return next({ ctx });
  });
}
