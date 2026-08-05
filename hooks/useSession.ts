"use client";

import { trpc } from "@/lib/trpc";

/**
 * Lightweight session access hook.
 *
 * Uses tRPC to fetch the current user session from server-side Redis-backed
 * session storage. This is the preferred way to access auth state in client
 * components for capabilities checks, user menus, etc.
 *
 * For login/logout actions, use `useAuth` from `@/hooks/useAuth`.
 *
 * @example
 * ```tsx
 * const { user, isLoading } = useSession()
 * if (isLoading) return <Spinner />
 * if (!user) redirect('/login')
 * ```
 */
export function useSession() {
  const { data: session, isLoading, isError, error } = trpc.auth.me.useQuery(
    undefined,
    {
      staleTime: 60_000,       // 1 minute before background refetch
      retry: false,             // don't retry on auth errors
      refetchOnWindowFocus: true,
    },
  );

return {
    session,
    userId: session?.userId ?? null,
    role: session?.role ?? null,
    tenantId: session?.tenantId ?? null,
    isLoading,
    isError,
    error,
    isAuthenticated: !!session?.userId,
  };
}
