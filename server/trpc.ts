import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getSession } from "@/lib/session";
import { cookies as nextCookies } from "next/headers";

import type { SessionPayload } from "@/lib/session";

export interface Context {

  tenantId: string;
  userId: string;
  userRole: "ADMIN" | "HR" | "EMPLOYEE" | string;
  session?: Pick<SessionPayload, "employeeId" | "legalEntityId" | "departments" | "legalEntities" | "mfaVerified">;
}



// Reads tenant/user claims from the Redis-backed session set by auth routes.
export async function createContext(): Promise<Context> {
  const cookieStore = await nextCookies();
  const cookie = cookieStore.get("__session")?.value;


  if (!cookie) {
    // Allow public procedures to exist; protected/guarded will enforce.
    return {
      tenantId: "",
      userId: "",
      userRole: "EMPLOYEE",
    };
  }

  const session = await getSession(cookie);
  if (!session) {
    return {
      tenantId: "",
      userId: "",
      userRole: "EMPLOYEE",
    };
  }

  return {
    tenantId: session.tenantId,
    userId: session.userId,
    userRole: session.role,
    session: {
      employeeId: session.employeeId,
      legalEntityId: session.legalEntityId,
      departments: session.departments,
      legalEntities: session.legalEntities,
      mfaVerified: session.mfaVerified,
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
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const createTRPCRouter = router;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});

export const guardedProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.tenantId) throw new TRPCError({ code: "UNAUTHORIZED" });
  // RLS session GUCs are set per-query via withRlsContext (server/middleware/rls.ts).
  // This guard ensures tenantId is always present before any tenant-scoped procedure runs.
  return next({ ctx });
});
