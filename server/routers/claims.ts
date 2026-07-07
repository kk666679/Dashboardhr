import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const claimsRouter = router({
  listClaims: protectedProcedure
    .input(z.object({ employeeId: z.string().min(1) }))
    .query(() => {
      // TODO: replace with real persistence (Prisma)
      return [] as {
        id: string;
        title: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        totalAmount: number;
        createdAt: string;
      }[];
    }),

  submitClaim: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().min(1),
        title: z.string().min(1),
        items: z.array(
          z.object({
            category: z.string().min(1),
            amount: z.number().nonnegative(),
            date: z.coerce.date(),
          }),
        ),
      }),
    )
    .mutation(async () => {
      // TODO: replace with real persistence (Prisma)
      return { success: true };
    }),
});

