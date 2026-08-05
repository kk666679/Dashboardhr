"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  AlertCircle,
  Users,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";

// Lazy-load heavy per-agent components so they are only bundled when needed
const AIComplianceAgent = dynamic(
  () => import("./ai-compliance-agent").then((m) => m.AIComplianceAgent),
  { loading: () => <AgentSkeleton /> }
);
const AIRecruitmentAgent = dynamic(
  () => import("./ai-recruitment-agent").then((m) => m.AIRecruitmentAgent),
  { loading: () => <AgentSkeleton /> }
);
const AIPayrollAgent = dynamic(
  () => import("./ai-payroll-agent").then((m) => m.AIPayrollAgent),
  { loading: () => <AgentSkeleton /> }
);
const AIEmployeeAgent = dynamic(
  () => import("./ai-employee-agent").then((m) => m.AIEmployeeAgent),
  { loading: () => <AgentSkeleton /> }
);
const AIExpatAgent = dynamic(
  () => import("./ai-expat-agent").then((m) => m.AIExpatAgent),
  { loading: () => <AgentSkeleton /> }
);

function AgentSkeleton() {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Loading agent…</span>
    </div>
  );
}

const AGENTS = [
  {
    id: "compliance",
    label: "Compliance Agent",
    icon: AlertCircle,
    color: "border-red-200 bg-red-50 text-red-800",
    description: "Malaysian labor laws, permits, FOMEMA, levy compliance",
  },
  {
    id: "recruitment",
    label: "Recruitment Agent",
    icon: Users,
    color: "border-blue-200 bg-blue-50 text-blue-800",
    description: "Job matching, visa eligibility, candidate screening",
  },
  {
    id: "payroll",
    label: "Payroll Agent",
    icon: DollarSign,
    color: "border-green-200 bg-green-50 text-green-800",
    description: "Salary calc, EPF/SOCSO/PCB, payslips, anomalies",
  },
  {
    id: "employee",
    label: "Employee Agent",
    icon: Users,
    color: "border-purple-200 bg-purple-50 text-purple-800",
    description: "Onboarding, performance, training, ER/IR",
  },
  {
    id: "expat",
    label: "Expat Agent",
    icon: FileText,
    color: "border-orange-200 bg-orange-50 text-orange-800",
    description: "Visa/permits, relocation, expatriate management",
  },
] as const;

export function AIChatHub() {
  const [activeAgent, setActiveAgent] = useState<
    "compliance" | "recruitment" | "payroll" | "employee" | "expat"
  >("compliance");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="h-8 w-8" />
            HR AI Agent Hub
            <Badge variant="secondary" className="ml-auto">
              All Agents Online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Specialized AI agents for every HR domain. Chat with compliance,
            recruitment, payroll experts and more.
          </p>

          <Tabs
            value={activeAgent}
            onValueChange={(v) => setActiveAgent(v as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
              {AGENTS.map(({ id, label, icon: Icon, color: _color }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground flex flex-col items-center gap-1 py-2 h-auto"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="compliance" className="pt-6">
              <AIComplianceAgent />
            </TabsContent>
            <TabsContent value="recruitment" className="pt-6">
              <AIRecruitmentAgent />
            </TabsContent>
            <TabsContent value="payroll" className="pt-6">
              <AIPayrollAgent />
            </TabsContent>
            <TabsContent value="employee" className="pt-6">
              <AIEmployeeAgent />
            </TabsContent>
            <TabsContent value="expat" className="pt-6">
              <AIExpatAgent />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
