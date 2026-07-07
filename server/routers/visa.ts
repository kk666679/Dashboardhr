import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getExpiringVisas,
  getVisasByEmployee,
  createVisa,
  renewVisa,
} from "@/lib/visa-service";

export const visaRouter = router({
  expiring: protectedProcedure
    .input(z.object({ days: z.number().int().min(1).max(365).default(30) }))
    .query(({ ctx, input }) => getExpiringVisas(ctx.tenantId, input.days)),

  byEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(({ ctx, input }) =>
      getVisasByEmployee(input.employeeId, ctx.tenantId),
    ),

  create: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        type: z.string().min(1),
        number: z.string().min(1),
        issueDate: z.coerce.date(),
        expiryDate: z.coerce.date(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createVisa({ ...input, tenantId: ctx.tenantId }),
    ),

  renew: protectedProcedure
    .input(z.object({ visaId: z.string(), newExpiryDate: z.coerce.date() }))
    .mutation(({ input }) => renewVisa(input.visaId, input.newExpiryDate)),
});
