import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, abacProcedure } from "@/server/trpc";
import { prisma } from "@/lib/prisma";

const roleSchema = z.enum(["ADMIN", "HR", "EMPLOYEE"]);
const integrationTypeSchema = z.enum([
  "BIOMETRIC_DEVICE",
  "PAYROLL_SYSTEM",
  "ACCOUNTING_SYSTEM",
  "BANKING_SYSTEM",
  "GOVERNMENT_PORTAL",
  "AI_PROVIDER",
  "EMAIL_SERVICE",
  "SMS_SERVICE",
  "CUSTOM",
]);

export const adminRouter = router({
  user: router({
    getAll: abacProcedure("admin", "read").query(async ({ ctx }) => {
      return prisma.user.findMany({
        where: { tenantId: ctx.tenantId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          employee: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
    getById: abacProcedure("admin", "read")
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const user = await prisma.user.findFirst({
          where: { id: input.id, tenantId: ctx.tenantId },
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
            employee: { select: { id: true, name: true, department: true } },
          },
        });
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        return user;
      }),
    create: abacProcedure("admin", "write")
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
          role: roleSchema.default("EMPLOYEE"),
          employeeId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await prisma.user.findUnique({ where: { email: input.email } });
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });

        const user = await prisma.user.create({
          data: {
            email: input.email,
            password: input.password,
            role: input.role,
            tenantId: ctx.tenantId,
            ...(input.employeeId ? { employee: { connect: { id: input.employeeId } } } : {}),
          },
          select: { id: true, email: true, role: true, createdAt: true },
        });
        return user;
      }),
    update: abacProcedure("admin", "write")
      .input(
        z.object({
          id: z.string(),
          email: z.string().email().optional(),
          role: roleSchema.optional(),
          isActive: z.boolean().optional(),
          employeeId: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const user = await prisma.user.findFirst({ where: { id, tenantId: ctx.tenantId } });
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        const updateData: any = { ...data };
        if (data.employeeId === null) {
          updateData.employee = { disconnect: true };
          delete updateData.employeeId;
        } else if (data.employeeId) {
          updateData.employee = { connect: { id: data.employeeId } };
          delete updateData.employeeId;
        }

        await prisma.user.update({ where: { id }, data: updateData });
        return { success: true };
      }),
    delete: abacProcedure("admin", "delete")
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await prisma.user.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        await prisma.user.update({
          where: { id: input.id },
          data: { deletedAt: new Date(), isActive: false },
        });
        return { success: true };
      }),
  }),

  role: router({
    getAll: abacProcedure("admin", "read").query(async ({ ctx }) => {
      const roles = await prisma.user.groupBy({
        by: ["role"],
        where: { tenantId: ctx.tenantId, deletedAt: null },
        _count: { id: true },
      });
      return roles.map((r: { role: string; _count: { id: number } }) => ({
        name: r.role,
        userCount: r._count.id,
      }));
    }),
    getById: abacProcedure("admin", "read")
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const role = roleSchema.safeParse(input.id);
        if (!role.success) throw new TRPCError({ code: "NOT_FOUND", message: "Role not found" });

        const [activeUsers, assignedUsers] = await Promise.all([
          prisma.user.count({
            where: { tenantId: ctx.tenantId, role: role.data, deletedAt: null, isActive: true },
          }),
          prisma.userRole.count({
            where: { tenantId: ctx.tenantId, role: role.data },
          }),
        ]);

        return {
          id: role.data,
          name: role.data,
          userCount: activeUsers,
          assignmentCount: assignedUsers,
          readonly: true,
        };
      }),
    create: abacProcedure("admin", "write")
      .input(z.object({ name: z.string(), description: z.string().optional() }))
      .mutation(async () => {
        return { id: "readonly", note: "Roles are enum-based in current schema" };
      }),
    update: abacProcedure("admin", "write")
      .input(z.object({ id: z.string(), name: z.string().optional() }))
      .mutation(async () => ({ success: true, note: "Roles are enum-based in current schema" })),
    delete: abacProcedure("admin", "delete")
      .input(z.object({ id: z.string() }))
      .mutation(async () => ({ success: true, note: "Roles are enum-based in current schema" })),
  }),

  permission: router({
    getAll: abacProcedure("admin", "read").query(async ({ ctx }) => {
      return prisma.featureFlag.findMany({
        where: { tenantId: ctx.tenantId },
        select: { key: true, name: true, enabled: true, description: true },
        orderBy: { key: "asc" },
      });
    }),
    toggle: abacProcedure("admin", "write")
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const flag = await prisma.featureFlag.findFirst({
          where: { id: input.id, tenantId: ctx.tenantId },
        });
        if (!flag) throw new TRPCError({ code: "NOT_FOUND", message: "Feature flag not found" });

        await prisma.featureFlag.update({
          where: { id: input.id },
          data: { enabled: !flag.enabled },
        });
        return { success: true };
      }),
  }),

  audit: router({
    getAll: abacProcedure("admin", "read").query(async ({ ctx }) => {
      return prisma.auditTrail.findMany({
        where: { tenantId: ctx.tenantId },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }),
    getById: abacProcedure("admin", "read")
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const entry = await prisma.auditTrail.findFirst({
          where: { id: input.id, tenantId: ctx.tenantId },
        });
        if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Audit entry not found" });
        return entry;
      }),
  }),

  backup: router({
    getAll: abacProcedure("admin", "read").query(async ({ ctx }) => {
      return prisma.auditTrail.findMany({
        where: {
          tenantId: ctx.tenantId,
          entityType: "BACKUP",
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }),
    create: abacProcedure("admin", "write").mutation(async () => {
      return { id: "manual", note: "Backup creation is handled at infrastructure level" };
    }),
    restore: abacProcedure("admin", "write")
      .input(z.object({ id: z.string() }))
      .mutation(async () => ({ success: true, note: "Backup restore is infra-level" })),
    delete: abacProcedure("admin", "delete")
      .input(z.object({ id: z.string() }))
      .mutation(async () => ({ success: true, note: "Backup deletion is infra-level" })),
  }),

  integration: router({
    getAll: abacProcedure("admin", "read").query(async ({ ctx }) => {
      return prisma.externalSystem.findMany({
        where: { tenantId: ctx.tenantId, deletedAt: null },
        include: {
          _count: {
            select: { apiClients: true, webhooks: true, syncJobs: true, integrationLogs: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),
    create: abacProcedure("admin", "write")
      .input(
        z.object({
          name: z.string().min(1),
          type: integrationTypeSchema,
          code: z.string().min(1).optional(),
          baseUrl: z.string().url().optional(),
          authType: z.string().optional(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const code = input.code ?? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
        return prisma.externalSystem.create({
          data: {
            tenantId: ctx.tenantId,
            name: input.name,
            code,
            systemType: input.type,
            baseUrl: input.baseUrl,
            authType: input.authType,
            isActive: input.isActive,
          },
        });
      }),
    update: abacProcedure("admin", "write")
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          type: integrationTypeSchema.optional(),
          code: z.string().min(1).optional(),
          baseUrl: z.string().url().nullable().optional(),
          authType: z.string().nullable().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await prisma.externalSystem.findFirst({
          where: { id: input.id, tenantId: ctx.tenantId, deletedAt: null },
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" });

        await prisma.externalSystem.update({
          where: { id: input.id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.type !== undefined ? { systemType: input.type } : {}),
            ...(input.code !== undefined ? { code: input.code } : {}),
            ...(input.baseUrl !== undefined ? { baseUrl: input.baseUrl } : {}),
            ...(input.authType !== undefined ? { authType: input.authType } : {}),
            ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
          },
        });
        return { success: true };
      }),
    delete: abacProcedure("admin", "delete")
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await prisma.externalSystem.findFirst({
          where: { id: input.id, tenantId: ctx.tenantId, deletedAt: null },
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" });

        await prisma.externalSystem.update({
          where: { id: input.id },
          data: { deletedAt: new Date(), isActive: false },
        });
        return { success: true };
      }),
    sync: abacProcedure("admin", "write")
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await prisma.externalSystem.findFirst({
          where: { id: input.id, tenantId: ctx.tenantId, deletedAt: null },
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" });

        const job = await prisma.dataSyncJob.create({
          data: {
            tenantId: ctx.tenantId,
            systemId: input.id,
            jobType: "MANUAL_SYNC",
            direction: "INBOUND",
            status: "PENDING",
          },
        });
        return { success: true, jobId: job.id };
      }),
  }),

  system: router({
    getStatus: abacProcedure("admin", "read").query(async ({ ctx }) => {
      const [userCount, employeeCount, auditCount, recentActivity] = await Promise.all([
        prisma.user.count({ where: { tenantId: ctx.tenantId, deletedAt: null } }),
        prisma.employee.count({ where: { tenantId: ctx.tenantId, deletedAt: null } }),
        prisma.auditTrail.count({ where: { tenantId: ctx.tenantId } }),
        prisma.auditTrail.count({
          where: {
            tenantId: ctx.tenantId,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        }),
      ]);

      return {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        stats: {
          totalUsers: userCount,
          totalEmployees: employeeCount,
          totalAuditEntries: auditCount,
          recentActivity24h: recentActivity,
        },
        version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      };
    }),
  }),
});
