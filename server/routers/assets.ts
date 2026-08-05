import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const assetsRouter = router({
  listAssets: protectedProcedure
    .input(z.object({ assignedTo: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const assets = await prisma.asset.findMany({
        where: {
          tenantId: ctx.tenantId,
          employeeId: input.assignedTo,
          deletedAt: null,
        },
        orderBy: [{ status: "asc" }, { assignedDate: "desc" }],
      });

      return (assets as any[]).map((asset: any) => ({
        ...asset,
        purchasePrice: asset.purchasePrice == null ? null : Number(asset.purchasePrice),
        assignedDate: asset.assignedDate?.toISOString() ?? null,
      }));
    }),
});
