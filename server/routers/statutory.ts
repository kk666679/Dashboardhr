import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const statutoryRouter = router({
  list: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      // TODO: implement actual statutory tax/EPF/SOCSO outputs.
      const employees = await prisma.employee.count({ where: { tenantId: ctx.tenantId } });
      return { employees, items: [] as any[] };
    }),

  calculateBulk: protectedProcedure
    .input(z.object({
      runId: z.string().min(1),
      periodEnd: z.coerce.date(),
    }))
    .mutation(async ({ input }) => {
      // Placeholder until we wire statutory calculations to real payroll outputs.
      return { processed: 0, runId: input.runId };
    }),

  calculate: protectedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      grossSalary: z.number().nonnegative(),
      periodEnd: z.coerce.date(),
      ageAtPeriodEnd: z.number().int().min(0),
    }))
    .query(async ({ input }) => {
      // Placeholder calculation model.
      const gross = input.grossSalary;
      const epfEmployee = gross * 0.11;
      const epfEmployer = gross * 0.12;
      const socsoEmployee = gross * 0.01;
      const eisEmployee = gross * 0.005;
      const pcb = gross * 0.0;
      const totalEmployeeDeductions = epfEmployee + socsoEmployee + eisEmployee + pcb;
      const netPay = gross - totalEmployeeDeductions;

      return {
        epf: { employee: epfEmployee, employer: epfEmployer },
        socso: { employee: socsoEmployee },
        eis: { employee: eisEmployee },
        pcb,
        totalEmployeeDeductions,
        netPay,
      };
    }),
});


