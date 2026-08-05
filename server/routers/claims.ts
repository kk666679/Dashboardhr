import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const claimsRouter = router({
  listClaims: protectedProcedure
    .input(z.object({ employeeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const claims = await prisma.claim.findMany({
        where: {
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
          deletedAt: null,
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });

      return (claims as any[]).map((claim: any) => ({
        ...claim,
        totalAmount: Number(claim.totalAmount),
        paidAmount: claim.paidAmount == null ? null : Number(claim.paidAmount),
        items: (claim.items as any[]).map((item: any) => ({ ...item, amount: Number(item.amount) })),
      }));
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
    .mutation(async ({ ctx, input }) => {
      const totalAmount = input.items.reduce((sum, item) => sum + item.amount, 0);

      const claim = await prisma.claim.create({
        data: {
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
          title: input.title,
          category: input.items[0]?.category ?? "OTHER",
          totalAmount,
          status: "PENDING",
          submittedAt: new Date(),
          items: {
            create: input.items.map((item) => ({
              tenantId: ctx.tenantId,
              category: item.category,
              amount: item.amount,
              date: item.date,
            })),
          },
        },
        include: { items: true },
      });

      await prisma.auditTrail.create({
        data: {
          tenantId: ctx.tenantId,
          entityType: "Claim",
          entityId: claim.id,
          action: "CREATE",
          actorId: ctx.userId,
          actorRole: ctx.userRole,
          newValue: { employeeId: input.employeeId, totalAmount, itemCount: input.items.length },
          metadata: { source: "auto-flag.claims.submit" },
        },
      });

      return { success: true, claimId: claim.id };
    }),
});
