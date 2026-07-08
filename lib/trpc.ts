import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/root";

// Client-side tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

export type { AppRouter };
