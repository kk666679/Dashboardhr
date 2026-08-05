"use client";

import type { ReactNode } from "react";

/**
 * @deprecated The root `Providers` component owns the shared tRPC client.
 * Kept as a no-op compatibility wrapper while route layouts are migrated.
 */
export function TRPCProvider({ children }: { children: ReactNode }) {
  return children;
}
