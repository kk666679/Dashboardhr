import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/root";

// Client-side tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Alias for the tRPC client (used by ISO feature pages/components)
export const api = trpc;

export function useTRPC() {
  return trpc;
}

export type { AppRouter };
