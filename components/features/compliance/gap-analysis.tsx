"use client";

import type { ReactNode } from "react";

export function GapAnalysis(_props: { children?: ReactNode } = {}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-sm text-[var(--foreground-muted)]">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Gap Analysis</h2>
      <p className="mt-2">
        This section is not yet implemented. It exists as a build-time placeholder so
        routes can render.
      </p>
    </div>
  );
}

