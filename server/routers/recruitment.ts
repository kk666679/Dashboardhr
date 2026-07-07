import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const recruitmentRouter = router({
  pipeline: protectedProcedure.query(() => [] as {
    id: string;
    name: string;
    role: string;
    experience: number;
    skills: string[];
    status: string;
  }[]),

  jdCreate: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string().optional() }))
    .mutation(({ input }) => ({
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? "",
      createdAt: new Date().toISOString(),
    })),
});
