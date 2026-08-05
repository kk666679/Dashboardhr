/**
 * Onboarding tRPC Router — Sprint 10
 *
 * Manages preboarding checklists, task completion, IT provisioning triggers,
 * and asset assignment linkage.
 *
 * Requirements: 10.1–10.8
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { writeAuditEntry } from "@/lib/shared-kernel/audit/audit-middleware";
import { dispatchNotification } from "@/lib/notification-dispatch";

// Default onboarding task template
const DEFAULT_TASKS = [
  { taskKey: "welcome_email",      title: "Send welcome email",               category: "HR",         isRequired: true,  sortOrder: 1 },
  { taskKey: "id_verification",    title: "Verify identity documents",         category: "HR",         isRequired: true,  sortOrder: 2 },
  { taskKey: "contract_signed",    title: "Sign employment contract",          category: "HR",         isRequired: true,  sortOrder: 3 },
  { taskKey: "bank_details",       title: "Submit bank account details",       category: "HR",         isRequired: true,  sortOrder: 4 },
  { taskKey: "epf_socso_reg",      title: "EPF / SOCSO registration",          category: "COMPLIANCE", isRequired: true,  sortOrder: 5 },
  { taskKey: "it_account",         title: "Create IT accounts (email / VPN)",  category: "IT",         isRequired: true,  sortOrder: 6 },
  { taskKey: "laptop_issued",      title: "Issue laptop / equipment",          category: "IT",         isRequired: false, sortOrder: 7 },
  { taskKey: "access_card",        title: "Issue building access card",        category: "IT",         isRequired: false, sortOrder: 8 },
  { taskKey: "orientation",        title: "Attend orientation session",        category: "HR",         isRequired: true,  sortOrder: 9 },
  { taskKey: "policy_ack",         title: "Acknowledge company policies",      category: "COMPLIANCE", isRequired: true,  sortOrder: 10 },
  { taskKey: "line_manager_meet",  title: "Meet with line manager",            category: "GENERAL",    isRequired: false, sortOrder: 11 },
  { taskKey: "probation_goals",    title: "Set probation goals with manager",  category: "GENERAL",    isRequired: false, sortOrder: 12 },
];

export const onboardingRouter = router({

  getChecklistByEmployee: guardedProcedure
    .input(z.object({ employeeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const employee = await prisma.employee.findFirst({
        where:  { id: input.employeeId, tenantId: ctx.tenantId },
        select: { id: true, name: true },
      });
      if (!employee) throw new TRPCError({ code: "NOT_FOUND" });

      let checklist = await prisma.onboardingChecklist.findFirst({
        where:   { tenantId: ctx.tenantId, employeeId: input.employeeId },
        include: { tasks: { orderBy: { sortOrder: "asc" } } },
      });

      // Auto-create checklist on first access
      if (!checklist) {
        checklist = await prisma.onboardingChecklist.create({
          data: {
            tenantId:   ctx.tenantId,
            employeeId: input.employeeId,
            status:     "IN_PROGRESS",
            tasks: {
              create: DEFAULT_TASKS,
            },
          },
          include: { tasks: { orderBy: { sortOrder: "asc" } } },
        });
      }

      const total     = checklist.tasks.length;
      const completed = checklist.tasks.filter((t: any) => t.isCompleted).length;

      return {
        id:           checklist.id,
        employeeId:   checklist.employeeId,
        status:       checklist.status,
        completionPct: total > 0 ? Math.round((completed / total) * 100) : 0,
        dueDate:      checklist.dueDate?.toISOString(),
        tasks:        checklist.tasks,
      };
    }),

  completeTask: guardedProcedure
    .input(z.object({
      taskId:     z.string().min(1),
      employeeId: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.onboardingTask.findFirst({
        where: { id: input.taskId },
        include: {
          checklist: { select: { tenantId: true, employeeId: true, id: true } },
        },
      });

      if (!task || task.checklist.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prisma.onboardingTask.update({
        where: { id: input.taskId },
        data:  { isCompleted: true, completedBy: ctx.userId, completedAt: new Date() },
      });

      // Check if all required tasks done → mark checklist complete
      const allTasks = await prisma.onboardingTask.findMany({
        where: { checklistId: task.checklistId },
      });
      const allRequiredDone = allTasks
        .filter((t: any) => t.isRequired)
        .every((t: any) => t.isCompleted || t.id === input.taskId);

      if (allRequiredDone) {
        await prisma.onboardingChecklist.update({
          where: { id: task.checklistId },
          data:  { status: "COMPLETED", completedAt: new Date() },
        });

        await dispatchNotification({
          tenantId:    ctx.tenantId,
          recipientId: task.checklist.employeeId,
          eventType:   "onboarding.completed",
          channel:     "IN_APP",
          subject:     "Onboarding complete!",
          body:        "All required onboarding tasks have been completed.",
        });
      }

      await writeAuditEntry({
        tenantId:   ctx.tenantId,
        module:     "onboarding",
        entityType: "OnboardingTask",
        entityId:   input.taskId,
        action:     "UPDATE",
        actorId:    ctx.userId,
        actorRole:  ctx.userRole,
        newValue:   { isCompleted: true },
      });

      return { success: true };
    }),

  createChecklist: guardedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      dueDate:    z.coerce.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.onboardingChecklist.findFirst({
        where: { tenantId: ctx.tenantId, employeeId: input.employeeId },
      });
      if (existing) return existing;

      return prisma.onboardingChecklist.create({
        data: {
          tenantId:   ctx.tenantId,
          employeeId: input.employeeId,
          dueDate:    input.dueDate,
          tasks: { create: DEFAULT_TASKS },
        },
        include: { tasks: true },
      });
    }),

  listChecklists: guardedProcedure
    .input(z.object({
      status: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const checklists = await prisma.onboardingChecklist.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(input?.status ? { status: input.status } : {}),
        },
        include: { tasks: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
      });

      return checklists.map((checklist: any) => {
        const total     = checklist.tasks.length;
        const completed = checklist.tasks.filter((t: any) => t.isCompleted).length;
        return {
          id:            checklist.id,
          employeeId:    checklist.employeeId,
          status:        checklist.status,
          completionPct: total > 0 ? Math.round((completed / total) * 100) : 0,
          dueDate:       checklist.dueDate?.toISOString(),
        };
      });
    }),

  listOverdue: guardedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const now = new Date();
      return prisma.onboardingChecklist.findMany({
        where: {
          tenantId: ctx.tenantId,
          status:   "IN_PROGRESS",
          dueDate:  { lt: now },
        },
        include: { tasks: { where: { isCompleted: false, isRequired: true } } },
        orderBy: { dueDate: "asc" },
      });
    }),
});