"use server";

import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { CreateEmployeeSchema, EmployeeFiltersSchema } from "@/lib/schemas";

type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
type EmployeeFilters = z.infer<typeof EmployeeFiltersSchema>;

// Prisma types sometimes resolve to `{}` in this repo’s TS setup.
// For this query we only need a compatible shape; keep the runtime filter logic intact.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmployeeWhereInput = Record<string, any>;

export async function createEmployee(tenantId: string, data: CreateEmployeeInput) {
  return prisma.employee.create({
    data: {
      tenantId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      nationality: data.nationality,
      isForeign: data.isForeign ?? false,
      position: data.position,
      department: data.department,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
      address: data.address,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      country: data.country,
      tags: data.tags ?? [],
    },
    include: { visas: true, contracts: true, documents: true },
  });
}

export async function getEmployeeById(id: string, tenantId: string) {
  return prisma.employee.findFirst({
    where: { id, tenantId },
    include: {
      visas: { orderBy: { expiryDate: "desc" } },
      contracts: { orderBy: { startDate: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      payrolls: { orderBy: { periodEnd: "desc" }, take: 12 },
    },
  });
}

export async function getEmployeesByTenant(
  tenantId: string,
  filters?: EmployeeFilters,
) {
  const where: EmployeeWhereInput = {
    tenantId,
    ...(filters?.department && { department: filters.department }),
    ...(filters?.isForeign !== undefined && { isForeign: filters.isForeign }),
    ...(filters?.position && { position: filters.position }),
  };

  return prisma.employee.findMany({
    where,
    include: { visas: true, contracts: true },
    orderBy: { createdAt: "desc" },
  }) as any;
}

export async function updateEmployee(
  id: string,
  tenantId: string,
  data: Partial<CreateEmployeeInput>,
) {
  return prisma.employee.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.position && { position: data.position }),
      ...(data.department && { department: data.department }),
      ...(data.nationality && { nationality: data.nationality }),
      ...(data.hireDate && { hireDate: new Date(data.hireDate) }),
    },
    include: { visas: true, contracts: true, documents: true },
  });
}

export async function deleteEmployee(id: string, tenantId: string) {
  return prisma.employee.delete({ where: { id } });
}
