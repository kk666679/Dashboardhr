import { prisma } from "@/lib/prisma";
import type { DashboardData } from "@/types";
import { DashboardDataSchema } from "@/lib/schema";

export async function getDashboardData(tenantId: string): Promise<DashboardData> {
  const [employees, total, foreign, active] = await Promise.all([
    prisma.employee.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        position: true,
        department: true,
        isForeign: true,
        hireDate: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 25,
    }),
    prisma.employee.count({ where: { tenantId } }),
    prisma.employee.count({ where: { tenantId, isForeign: true } }),
    prisma.employee.count({ where: { tenantId } }),
  ]);

  const mapped = employees.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone ?? undefined,
    position: e.position ?? undefined,
    department: e.department ?? undefined,
    isForeign: e.isForeign,
    hireDate: e.hireDate?.toISOString().split("T")[0] ?? undefined,
    createdAt: e.createdAt.toISOString(),
  }));

  return DashboardDataSchema.parse({
    employees: mapped,
    stats: {
      total,
      active,
      foreign,
    },
  });
}
