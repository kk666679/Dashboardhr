"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { getLocaleFromPath, setLocaleInPath } from "@/lib/locale-utils";

/**
 * Centralized authentication hook using tRPC.
 *
 * Session state is managed server-side via Redis-backed sessions.
 * The client only holds a lightweight indicator via tRPC context.
 * Do NOT store permissions/roles separately on the client —
 * authorization is enforced server-side via ABAC middleware.
 *
 * @see /docs/ARCHITECTURE.md — Authentication State
 */
export function useAuth() {
  const router = useRouter();
  const utils = trpc.useUtils();

  // Session query — fetched via tRPC, cached appropriately
  const { data: session, isLoading: loading } = trpc.auth.me.useQuery(
    undefined,
    {
      staleTime: 60_000,       // 1 minute before background refetch
      retry: false,             // don't retry on auth errors
      refetchOnWindowFocus: true,
    },
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await utils.auth.me.invalidate();
        const locale = getLocaleFromPath(typeof window !== "undefined" ? window.location.pathname : "");
        router.push(setLocaleInPath("/dashboard", locale));
      }
      return response;
    },
    [router, utils.auth.me],
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (response.ok) {
        const locale = getLocaleFromPath(typeof window !== "undefined" ? window.location.pathname : "");
        router.push(setLocaleInPath("/login", locale));
      }
      return response;
    },
    [router],
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    utils.auth.me.invalidate();
    utils.auth.me.reset();
    const locale = getLocaleFromPath(typeof window !== "undefined" ? window.location.pathname : "");
    router.push(setLocaleInPath("/login", locale));
  }, [router, utils.auth.me]);

return {
    session,
    user: {
      userId: session?.userId ?? null,
      role: session?.role ?? null,
      tenantId: session?.tenantId ?? null,
    },
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session?.userId,
  };
}

