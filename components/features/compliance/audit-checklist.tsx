"use client";

import type { ReactNode } from "react";

export function AuditChecklist(_props: { children?: ReactNode } = {}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] p-6 text-sm text-[var(--foreground-muted)]">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Audit Checklist</h2>
      <p className="mt-2">
        Placeholder component for build. Implement UI and data wiring later.
      </p>
    </div>
  );
}

