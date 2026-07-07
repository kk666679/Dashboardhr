import { TRPCError } from "@trpc/server";
import type { AnyMiddlewareFunction } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import type { AuditContext, AuditEntry, AuditAction } from "./audit-trail";

function inferAuditActionFromPath(path: unknown): AuditAction {
  const p = typeof path === "string" ? path : "";
  if (p.includes("create") || p.includes("insert") || p.includes("add")) return "CREATE";
  if (p.includes("delete") || p.includes("remove")) return "DELETE";
  if (p.includes("get") || p.includes("list") || p.includes("query") || p.includes("read")) return "READ";
  return "UPDATE";
}

export function createAuditMiddleware(context: AuditContext) {
  const middleware: AnyMiddlewareFunction = async ({ next, path }) => {
    // NOTE: transactional correctness for the audit record itself requires
    // wrapping the domain action + this write in the same DB transaction.
    // This middleware records audit entries for successful operations; future
    // milestones will integrate with transaction-scoped writes.
    const result = await next();

    if (!result.ok) return result;

    try {
      const entityType = typeof path === "string" ? path.split(".")[0] : "unknown";
      const action = inferAuditActionFromPath(path);

      await prisma.auditTrail.create({
        data: {
          tenantId: context.tenantId,
          entityType,
          entityId: context.userId ?? "system",
          action,
          actorId: context.userId ?? null,
          actorRole: context.userRole ?? undefined,
          metadata: { path, inferredAction: action },
        },
      });
    } catch (error) {
      console.warn("Audit trail write failed", error);
    }

    return result;
  };

  return middleware;
}


export async function writeAuditEntry(entry: AuditEntry) {
  try {
    return await prisma.auditTrail.create({
      data: {
        tenantId: entry.tenantId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        actorId: entry.actorId ?? null,
        previousValue: entry.previousValue as any ?? undefined,
        newValue: entry.newValue as any ?? undefined,
        metadata: entry.metadata as any ?? undefined,
      },
    });
  } catch {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Audit write failed" });
  }
}
