"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/auth";

export interface TenantContext {
  tenantId: string;
  tenantName: string;
  userId: string;
  userRole: "ADMIN" | "HR" | "EMPLOYEE";
}

/**
 * Returns the authenticated tenant context from the Redis-backed session.
 * Falls back to a guest context when unauthenticated.
 */
export async function getTenantContext(): Promise<TenantContext> {
  const session = await getCurrentSession();

  if (session) {
    const tenant = session.tenantId
      ? await prisma.tenant.findUnique({ where: { id: session.tenantId } })
      : null;

    return {
      tenantId: session.tenantId,
      tenantName: tenant?.name ?? "Unknown",
      userId: session.userId,
      userRole: (session.role as TenantContext["userRole"]) || "EMPLOYEE",
    };
  }

  // Unauthenticated fallback — no hardcoded tenant
  return {
    tenantId: "",
    tenantName: "Guest",
    userId: "guest",
    userRole: "EMPLOYEE",
  };
}

export async function createTenant(name: string, domain?: string) {
  return await prisma.tenant.create({
    data: {
      name,
      domain: domain || name.toLowerCase().replace(/\s+/g, "-"),
    },
  });
}

export async function getTenantByDomain(domain: string) {
  return await prisma.tenant.findUnique({
    where: { domain },
  });
}

export async function getTenantById(id: string) {
  return await prisma.tenant.findUnique({
    where: { id },
  });
}
