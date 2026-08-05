"use client";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Shield, Globe, CreditCard,
  UserCheck, Plane, Bot, ArrowRight,
} from "lucide-react";

const DASHBOARDS = [
  { title: "Executive Dashboard", href: "dashboards/executive", icon: LayoutDashboard, desc: "C-suite KPIs and strategic overview", badge: "Live" },
  { title: "HR Dashboard", href: "dashboards/hr", icon: Users, desc: "Headcount, leave, performance", badge: null },
  { title: "Compliance Dashboard", href: "dashboards/compliance", icon: Shield, desc: "Regulatory status and risk scores", badge: null },
  { title: "Immigration Dashboard", href: "dashboards/immigration", icon: Globe, desc: "Permit expiry and immigration status", badge: null },
  { title: "Payroll Dashboard", href: "dashboards/payroll", icon: CreditCard, desc: "Payroll costs and statutory contributions", badge: null },
  { title: "Foreign Worker Dashboard", href: "dashboards/foreign-worker", icon: UserCheck, desc: "FW workforce metrics and compliance", badge: null },
  { title: "Expatriate Dashboard", href: "dashboards/expatriate", icon: Plane, desc: "Expat assignment lifecycle and costs", badge: null },
  { title: "AI Operations Dashboard", href: "dashboards/ai-ops", icon: Bot, desc: "Agent performance and automation metrics", badge: "New" },
];

export default function DashboardsHubPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const nav = (path: string) => router.push(`/${locale}/dashboard/${path}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboards"
        description="Role-specific dashboards with drill-down analytics"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARDS.map((d) => (
          <Card
            key={d.href}
            className="cursor-pointer transition-shadow hover:shadow-md group"
            onClick={() => nav(d.href)}
            role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && nav(d.href)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <d.icon className="size-7 text-[var(--brand)]" />
                {d.badge && <Badge variant="secondary" className="text-[10px]">{d.badge}</Badge>}
              </div>
              <CardTitle className="text-sm mt-2">{d.title}</CardTitle>
              <CardDescription className="text-xs">{d.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs p-0 group-hover:text-[var(--brand)]">
                Open <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
