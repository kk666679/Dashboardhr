import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  createPayroll,
  processPayroll,
  generatePayslip,
  getPayrollsByEmployee,
  getPayrollsByTenant,
} from "@/lib/payroll-service";
import { PayrollStatusSchema } from "@/lib/schemas";

export const payrollRouter = router({
  list: protectedProcedure
    .input(z.object({ status: PayrollStatusSchema.optional() }).optional())
    .query(({ ctx, input }) => getPayrollsByTenant(ctx.tenantId, input)),

  byEmployee: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        limit: z.number().int().min(1).max(24).default(12),
      }),
    )
    .query(({ ctx, input }) =>
      getPayrollsByEmployee(input.employeeId, ctx.tenantId, input.limit),
    ),

  create: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodStart: z.coerce.date(),
        periodEnd: z.coerce.date(),
        basicSalary: z.number().positive(),
        allowances: z.number().nonnegative().optional(),
        deductions: z.number().nonnegative().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createPayroll({ ...input, tenantId: ctx.tenantId }),
    ),

  process: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => processPayroll(input.id)),

  payslip: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => generatePayslip(input.id)),
});
