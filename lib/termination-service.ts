import { prisma } from "@/lib/prisma";
import type { TerminationCreate, TerminationFilters } from "@/lib/schemas";

export async function getTerminationsByTenant(
  tenantId: string,
  filters?: TerminationFilters,
) {
  return prisma.termination.findMany({
    where: {
      tenantId,
      ...(filters?.status && { status: filters.status }),
    },
    include: {
      employee: true,
      approver: { include: { employee: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTermination(tenantId: string, data: TerminationCreate) {
  return prisma.termination.create({
    data: {
      tenant: { connect: { id: tenantId } },
      employee: { connect: { id: data.employeeId } },
      terminationType: data.terminationType as any,
      lastWorkingDay: new Date(data.lastWorkingDay),
      reason: data.reason,
      noticePeriodServed: data.noticePeriodServed,
      finalSalaryAmount: data.finalSalaryAmount,
      pendingLeave: data.pendingLeave ?? 0,
      otherPayments: data.otherPayments ?? 0,
      exitInterviewNotes: data.exitInterviewNotes,
      handoverStatus: data.handoverStatus as any,
    },
    include: { employee: true, approver: true },
  });
}
