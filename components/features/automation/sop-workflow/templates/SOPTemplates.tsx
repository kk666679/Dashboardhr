"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, ArrowRight } from "lucide-react";
import {
  FLOW_TEMPLATES,
  type FlowTemplate,
  getTemplatesByCategory,
} from "@/lib/flow-templates";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { useToast } from "@/components/ui/use-toast";

// SOP-relevant categories
const SOP_CATEGORIES = ["HR", "Onboarding", "Offboarding", "Compliance", "QMS"] as const;

const SOP_TEMPLATES = FLOW_TEMPLATES.filter((t) =>
  (SOP_CATEGORIES as readonly string[]).includes(t.category)
);

function fmt(minutes: number): string {
  if (minutes < 60)    return `${minutes}m`;
  if (minutes < 1440)  return `${Math.round(minutes / 60)}h`;
  if (minutes < 10080) return `${Math.round(minutes / 1440)}d`;
  return `${Math.round(minutes / 10080)}w`;
}

interface SOPTemplatesProps {
  /** Called when a template is loaded into the canvas */
  onLoad?: (template: FlowTemplate) => void;
}

export function SOPTemplates({ onLoad }: SOPTemplatesProps) {
  const { toast } = useToast();
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);

  const handleLoad = (tpl: FlowTemplate) => {
    loadTemplate(tpl.id);
    onLoad?.(tpl);
    toast({
      title: "Template loaded",
      description: `"${tpl.name}" — ${tpl.nodes.length} nodes added to canvas.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {SOP_TEMPLATES.length} SOP-related templates available
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOP_TEMPLATES.map((tpl) => (
          <Card
            key={tpl.id}
            className="cursor-pointer hover:shadow-md transition-shadow group"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm">{tpl.name}</CardTitle>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {tpl.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tpl.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" /> {tpl.steps} steps
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> ~{fmt(tpl.estimatedMinutes)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {tpl.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                variant="outline"
                onClick={() => handleLoad(tpl)}
              >
                Load Template
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
