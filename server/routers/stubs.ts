/**
 * Stub handlers for endpoints not yet implemented.
 * Migrate to agent.executeTool() pattern when ready.
 */
import { TRPCError } from "@trpc/server";

export const document = {
  list: async () => {
    throw new TRPCError({ code: "NOT_IMPLEMENTED", message: 'Use agent.executeTool("document.list")' });
  },
  create: async (_ctx: unknown, input: unknown) => {
    throw new TRPCError({ code: "NOT_IMPLEMENTED", message: 'Use agent.executeTool("document.create")' });
  },
};

export const process = {
  list: async (_ctx: unknown, input: unknown) => {
    throw new TRPCError({ code: "NOT_IMPLEMENTED", message: 'Use agent.executeTool("process.list")' });
  },
};

export const compliance = {
  check: async (_ctx: unknown, input: unknown) => {
    throw new TRPCError({ code: "NOT_IMPLEMENTED", message: 'Use agent.executeTool("compliance.check")' });
  },
};
