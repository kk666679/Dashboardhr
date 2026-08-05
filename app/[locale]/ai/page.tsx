"use client";

import Link from "next/link";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import {
  MessageSquare, Users, Shield, FileText, Globe,
  Network, BookOpen, CreditCard, UserPlus, Search,
  ArrowRight, Zap,
} from "lucide-react";

const AI_TOOLS = [
  { title: "Chat Hub",        description: "Multi-model AI chat — OpenAI, Anthropic Claude, Ollama",   href: "/ai/chat-hub",        Icon: MessageSquare, accent: "var(--brand)",              bg: "var(--brand-muted)"         },
  { title: "Employee AI",     description: "AI assistant for employee queries and HR self-service",    href: "/ai/employee",        Icon: Users,         accent: "var(--success-foreground)", bg: "var(--success-subtle)"      },
  { title: "Compliance AI",   description: "Malaysian statutory compliance guidance and gap analysis", href: "/ai/compliance",      Icon: Shield,        accent: "var(--destructive-foreground)", bg: "var(--destructive-subtle)"  },
  { title: "Doc Generator",   description: "Generate HR documents, contracts, and letters with AI",   href: "/ai/doc-generator",   Icon: FileText,      accent: "#a78bfa",                   bg: "oklch(0.62 0.22 290 / 0.1)" },
  { title: "Expat AI",        description: "Expatriate management, visa guidance, permit tracking",    href: "/ai/expat",           Icon: Globe,         accent: "var(--warning-foreground)", bg: "var(--warning-subtle)"      },
  { title: "HR Orchestrator", description: "Multi-agent orchestrator for complex HR workflows",       href: "/ai/hr-orchestrator", Icon: Network,       accent: "#818cf8",                   bg: "oklch(0.62 0.22 265 / 0.1)" },
  { title: "KB Chat",         description: "Chat with the knowledge base via RAG pipeline",           href: "/ai/kb-chat",         Icon: BookOpen,      accent: "var(--info-foreground)",    bg: "var(--info-subtle)"         },
  { title: "Payroll AI",      description: "Payroll calculations, EPF/SOCSO/EIS and PCB guidance",    href: "/ai/payroll",         Icon: CreditCard,    accent: "var(--warning-foreground)", bg: "var(--warning-subtle)"      },
  { title: "Recruitment AI",  description: "AI-assisted screening, job matching, and candidate ranking", href: "/ai/recruitment",  Icon: UserPlus,      accent: "#f472b6",                   bg: "oklch(0.62 0.22 345 / 0.1)" },
  { title: "Semantic Search", description: "Vector-based semantic search across all HR records",     href: "/ai/semantic-search",  Icon: Search,        accent: "var(--foreground-muted)",   bg: "var(--surface-2)"           },
] as const;

export default function AIHubPage() {
  return (
    <PageShell>
      <PageHeader
        title="AI Hub"
        description="AI-powered tools for every HR workflow — select a tool to get started"
        badge={<Badge variant="default" size="sm"><Zap className="size-3" /> 10 tools</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_TOOLS.map(({ title, description, href, Icon, accent, bg }) => (
          <Card key={href} variant="interactive" className="group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                  style={{ background: bg }}
                  aria-hidden="true"
                >
                  <Icon className="size-4.5" style={{ color: accent }} />
                </div>
                <CardTitle className="text-sm leading-tight">{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-xs leading-relaxed">
                {description}
              </CardDescription>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={href}>
                  Open {title}
                  <ArrowRight className="size-3.5 ml-auto" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
