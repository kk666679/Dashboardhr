import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const assetsRouter = router({
  listAssets: protectedProcedure
    .input(z.object({ assignedTo: z.string().min(1) }))
    .query(() => {
      // TODO: replace with real persistence (Prisma)
      return [] as {
        id: string;
        name: string;
        category: string;
        serialNumber?: string | null;
        assignedDate?: string | null;
        status: string;
      }[];
    }),
});

