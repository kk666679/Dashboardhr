// Re-export the single source of truth for tRPC React hooks.
// This must match the `trpc.Provider` client setup in `components/providers.tsx`.

export { trpc } from '@/lib/trpc';



export type { AppRouter } from '@/server/root';
