import { TRPCError } from "@trpc/server";
import { evaluateLegacyPolicy } from "@/lib/security/abac";

export const abacMiddleware = ({ ctx, next, path }: any) => {
  const permission = path.includes("employee") ? "read:employee" : "read:org";
  const policy = evaluateLegacyPolicy({
    tenantId: ctx.tenantId,
    userRole: ctx.userRole,
    userId: ctx.userId,
    permission,
  });

  if (!policy.allowed) {
    throw new TRPCError({ code: "FORBIDDEN", message: policy.reason ?? "Access denied" });
  }

  return next({ ctx });
};
