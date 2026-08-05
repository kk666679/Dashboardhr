"use client";

import type { ReactNode } from "react";

export function ComplianceCheck(_props: { children?: ReactNode } = {}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-sm text-[var(--foreground-muted)]">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Compliance Check</h2>
      <p className="mt-2">
        Placeholder component for build. Implement compliance checking later.
      </p>
    </div>
  );
}

