"use client";

/**
 * Flow Studio Page
 *
 * The next-generation workflow designer. Renders the full Flow Studio
 * orchestrator (canvas, palette, properties, AI copilot, execution panel,
 * version history, command menu, responsive mobile sheets).
 *
 * Supports launching with a template via `/automation/designer?template=<id>`
 * and an ISO standard via `&standard=<iso>`.
 */

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FlowStudio } from "@/components/features/automation/flow-studio";

function FlowStudioPageInner() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<{ template?: string; standard?: string }>({});
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const template = searchParams.get("template") ?? undefined;
    const standard = searchParams.get("standard") ?? undefined;
    setParams({ template, standard });
  }, []); // run once on mount

  if (!hasMounted) {
    // Avoid next/navigation hooks during prerender/SSG inspection.
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading Flow Studio…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <FlowStudio template={params.template} standard={params.standard} enableAI />
    </div>
  );
}

export default function FlowStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading Flow Studio…</p>
          </div>
        </div>
      }
    >
      <FlowStudioPageInner />
    </Suspense>
  );
}
