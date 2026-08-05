"use client";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare, Workflow, Sparkles, Shield, FileText,
  BarChart3, TrendingUp, Bot, ArrowRight, Zap,
} from "lucide-react";

const AI_MODULES = [
  { title: "AI Chat", description: "Conversational HR assistant", href: "ai/chat", icon: MessageSquare, badge: "Live", color: "text-blue-500" },
  { title: "Workflow Builder", description: "Design autonomous AI workflows", href: "ai/workflow-builder", icon: Workflow, badge: "Beta", color: "text-purple-500" },
  { title: "AI Recommendations", description: "Actionable insights from your data", href: "ai/recommendations", icon: Sparkles, badge: "New", color: "text-amber-500" },
  { title: "Compliance Advisor", description: "Regulatory compliance guidance", href: "ai/compliance-advisor", icon: Shield, badge: null, color: "text-green-500" },
  { title: "Document Assistant", description: "OCR, extraction & contract generation", href: "ai/document-assistant", icon: FileText, badge: null, color: "text-red-500" },
  { title: "AI Analytics", description: "Predictive workforce analytics", href: "ai/analytics", icon: BarChart3, badge: null, color: "text-cyan-500" },
  { title: "Workforce Forecasting", description: "Headcount and attrition forecasting", href: "ai/forecasting", icon: TrendingUp, badge: null, color: "text-indigo-500" },
  { title: "AI Agents", description: "Autonomous multi-agent orchestration", href: "ai/agents", icon: Bot, badge: "OpenClaw", color: "text-orange-500" },
];

export default function AICopilotPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const nav = (path: string) => router.push(`/${locale}/dashboard/${path}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Copilot"
        description="Autonomous AI agents and intelligent workflows powering your HR platform"
        actions={[{ label: "Open HR Orchestrator", icon: Zap, variant: "default", onClick: () => nav("ai/agents") }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AI_MODULES.map((mod) => (
          <Card
            key={mod.href}
            className="cursor-pointer transition-shadow hover:shadow-md group"
            onClick={() => nav(mod.href)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && nav(mod.href)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <mod.icon className={`size-8 ${mod.color}`} />
                {mod.badge && <Badge variant="secondary" className="text-[10px]">{mod.badge}</Badge>}
              </div>
              <CardTitle className="text-sm mt-2">{mod.title}</CardTitle>
              <CardDescription className="text-xs">{mod.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs group-hover:text-[var(--brand)]">
                Open <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
