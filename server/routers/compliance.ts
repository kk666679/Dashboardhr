import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { checkComplianceStatus } from "@/lib/compliance-engine";

export const complianceRouter = router({
  check: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await checkComplianceStatus(
        input.employeeId,
        ctx.tenantId,
      );
      if (!result)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found",
        });
      return result;
    }),
});
