"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Workflow } from "lucide-react";
import { FlowDesigner } from "@/components/features/automation/FlowDesigner";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

function DesignerInner() {
  const searchParams = useSearchParams();
  const flowId     = searchParams.get("flowId")   ?? undefined;
  const templateId = searchParams.get("template") ?? undefined;
  const standard   = searchParams.get("standard") ?? undefined;

  const templateLabel = templateId
    ? templateId.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col -m-4 md:-m-6 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href={ROUTE.dashboard.automation.root}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Hub
            </Link>
          </Button>
          <Workflow className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Flow Studio</span>
          {templateLabel && (
            <>
              <span className="text-muted-foreground text-sm">/</span>
              <Badge variant="secondary" className="text-xs">{templateLabel}</Badge>
            </>
          )}
          {standard && (
            <Badge variant="outline" className="text-xs">{standard}</Badge>
          )}
        </div>
        {templateId && (
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTE.dashboard.automation.templates}>
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              Templates
            </Link>
          </Button>
        )}
      </div>

      {/* Canvas — FlowDesigner owns palette, properties, toolbar */}
      <div className="flex-1 overflow-hidden">
        <FlowDesigner
          flowId={flowId}
          template={templateId}
          standard={standard}
          leftSidebarCollapsible
          rightSidebarCollapsible
          defaultShowMinimap
          defaultShowControls
        />
      </div>
    </div>
  );
}

export default function AutomationDesignerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-muted-foreground text-sm">Loading designer…</div>}>
      <DesignerInner />
    </Suspense>
  );
}
