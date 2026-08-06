"use client";

import { useState } from "react";
import { FLOW_TEMPLATES } from "@/lib/flow-templates";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, LayoutTemplate, X, Sparkles } from "lucide-react";

interface FlowStudioTemplateQuickPickProps {
  onClose?: () => void;
  className?: string;
}

/**
 * Floating template carousel — quick access to templates from the canvas.
 * No need to leave the studio.
 *
 * Quick Start categories: Onboarding, Leave Approval, Payroll, Recruitment.
 */
export function FlowStudioTemplateQuickPick({ onClose, className }: FlowStudioTemplateQuickPickProps) {
  const { toast } = useToast();
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);
  const [scrollIndex, setScrollIndex] = useState(0);

  const quickStart = FLOW_TEMPLATES.filter((t) =>
    ["onboarding", "leave-approval", "payroll-run", "recruitment"].includes(t.id)
  );
  const templates = quickStart.length >= 4 ? quickStart : FLOW_TEMPLATES.slice(0, 4);
  const visibleCount = 3;
  const maxScroll = Math.max(0, templates.length - visibleCount);

  const handlePick = (id: string, name: string) => {
    loadTemplate(id);
    toast({ title: "Template loaded", description: name });
  };

  return (
    <div className={cn("absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(680px,92vw)]", className)}>
      <div className="rounded-xl border bg-background/90 backdrop-blur-xl shadow-lg p-2.5">
        {/* Header */}
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">Quick Start</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-xs" disabled={scrollIndex === 0} onClick={() => setScrollIndex((i) => Math.max(0, i - 1))}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-xs" disabled={scrollIndex >= maxScroll} onClick={() => setScrollIndex((i) => Math.min(maxScroll, i + 1))}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon-xs" onClick={onClose}>
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex gap-2 transition-transform duration-300"
            style={{ transform: `translateX(-${scrollIndex * (100 / visibleCount)}%)` }}
          >
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => handlePick(t.id, t.name)}
                className="group flex-none w-1/3 rounded-lg border bg-card p-2.5 text-left hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <LayoutTemplate className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium truncate">{t.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1.5">{t.description}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-[9px]">{t.category}</Badge>
                  <span className="text-[9px] text-muted-foreground">{t.steps} steps</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
