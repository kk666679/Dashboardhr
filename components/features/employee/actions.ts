"use server";

import { prisma } from "@/lib/prisma";
import type { EmployeeRow } from "@/components/features/employee/employee";

export async function getEmployees(tenantId?: string) {
  const where = tenantId ? { tenantId } : {};
  return prisma.employee.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
      department: true,
      nationality: true,
      isForeign: true,
      hireDate: true,
    } as const,
  });
}
