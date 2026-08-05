import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const analyticsRouter = router({
  getAll: protectedProcedure.query(async () => []),
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async () => null),
});
