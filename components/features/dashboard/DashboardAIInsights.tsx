"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import {
  Agent,
  AgentHeader,
  AgentStatusDot,
  AgentContent,
} from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Panel, PanelHeader, PanelTitle, PanelDescription, PanelContent } from "@/components/ai-elements/panel";

interface DashboardAIInsightsProps {
  title?: string;
  description?: string;
  highlights?: string[];
  reasoning?: string;
  model?: string;
}

export function DashboardAIInsights({
  title = "HR Intelligence",
  description = "AI-generated guidance for your current dashboard view",
  highlights = [
    "Monitor workforce trends before they become operational risks",
    "Prioritize actions that improve retention and employee experience",
    "Surface anomalies and policy exceptions automatically",
  ],
  reasoning = "The dashboard is highlighting momentum in staffing, compliance, and employee engagement indicators.",
  model = "ai-assistant-v2",
}: DashboardAIInsightsProps) {
  const [status, setStatus] = useState<"idle" | "thinking" | "done">("idle");

  useEffect(() => {
    const timer = window.setTimeout(() => setStatus("thinking"), 200);
    const finishTimer = window.setTimeout(() => setStatus("done"), 900);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  return (
    <Panel className="overflow-hidden border border-border/70 bg-background/80">
      <PanelHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <PanelTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {title}
            </PanelTitle>
            <PanelDescription>{description}</PanelDescription>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Live insights
          </div>
        </div>
      </PanelHeader>

      <PanelContent>
        <Agent>
          <AgentHeader
            name="Executive Copilot"
            model={model}
            status={status}
            actions={
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <AgentStatusDot status={status} />
                {status === "idle" && "Preparing"}
                {status === "thinking" && "Analyzing"}
                {status === "done" && "Ready"}
              </span>
            }
          />

          {status === "done" && (
            <AgentContent>
              <Suggestions>
                {highlights.map((highlight) => (
                  <Suggestion key={highlight} suggestion={highlight} variant="outline" />
                ))}
              </Suggestions>
              <Reasoning defaultOpen={false}>
                <ReasoningTrigger />
                <ReasoningContent>{reasoning}</ReasoningContent>
              </Reasoning>
            </AgentContent>
          )}
        </Agent>
      </PanelContent>
    </Panel>
  );
}
