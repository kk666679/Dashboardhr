import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const accountingRouter = router({
  // Migration from accounting-api.ts & accounting-enhanced-api.ts
  // Using existing schema models (Payroll exists, Invoice demo as generic)

  // Payroll (uses existing Payroll model)
  payrollRecords: protectedProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "PROCESSED", "PAID"]).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return prisma.payroll.findMany({
        where: {
          tenantId: ctx.tenantId,
          status: input.status as any,
        },
        orderBy: { createdAt: "desc" },
      });
    }),
  payrollByEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ input, ctx }) =>
      prisma.payroll.findMany({
        where: {
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
        },
      }),
    ),

  calculatePayroll: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodStart: z.string().datetime(),
        periodEnd: z.string().datetime(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Demo: fetch basic salary from contract or employee
      const payrollData = {
        employeeId: input.employeeId,
        periodStart: new Date(input.periodStart),
        periodEnd: new Date(input.periodEnd),
        basicSalary: 4000, // from DB
        netSalary: 3600,
      };
      return prisma.payroll.create({
        data: {
          ...payrollData,
          tenantId: ctx.tenantId,
          status: "PENDING",
        },
      });
    }),

  // Demo Invoice (no model, use JsonDocument or extend schema later)
  invoices: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async () => {
      // Placeholder - extend schema with Invoice model
      return {
        demoInvoices: [],
        message: "Invoice model pending schema update",
      };
    }),
  createInvoice: protectedProcedure
    .input(
      z.object({
        customerName: z.string(),
        amount: z.number().positive(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Store as Json in Document or new model
      return { id: "demo-" + Date.now(), ...input };
    }),

  // Compliance summary (ties to existing)
  accountingSummary: protectedProcedure.query(async ({ ctx }) => {
    const [pendingPayrollCount, totalEmployees] = await Promise.all([
      prisma.payroll.count({
        where: { tenantId: ctx.tenantId, status: "PENDING" },
      }),
      prisma.employee.count({ where: { tenantId: ctx.tenantId } }),
    ]);
    return {
      pendingPayrolls: pendingPayrollCount,
      employeeCount: totalEmployees,
      payrollCompletionRate:
        totalEmployees > 0
          ? (1 - pendingPayrollCount / totalEmployees) * 100
          : 0,
    };
  }),

  // Tax demo
  calculateTax: protectedProcedure
    .input(
      z.object({
        grossIncome: z.number().positive(),
        type: z.enum(["PCB", "SST"]),
      }),
    )
    .mutation(({ input }) => {
      let taxRate = input.type === "PCB" ? 0.11 : 0.06; // demo rates
      return {
        taxableIncome: input.grossIncome,
        taxAmount: input.grossIncome * taxRate,
        type: input.type,
      };
    }),
});
