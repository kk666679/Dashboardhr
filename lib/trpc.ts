import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/root";

// Client-side tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

<<<<<<< HEAD
=======
// Alias for the tRPC client (used by ISO feature pages/components)
export const api = trpc;

export function useTRPC() {
  return trpc;
}

>>>>>>> 237f310 (Add libraries, services and application logic)
export type { AppRouter };
