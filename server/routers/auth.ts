/**
 * Authentication tRPC Router
 *
 * Provides session info to the client via tRPC.
 * Actual login/logout is handled by standard API routes for security.
 * This router exposes the current session/user identity only.
 *
 * @see /docs/ARCHITECTURE.md — Authentication State
 */

import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  /**
   * Returns the current authenticated user's identity.
   * Protected by the session middleware — if userId is present, the user is authenticated.
   * Further permission/role data is resolved server-side via ABAC, NOT sent to the client.
   */
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return null;
    }

    return {
      userId: ctx.userId,
      role: ctx.userRole,
      tenantId: ctx.tenantId,
    };
  }),
});

