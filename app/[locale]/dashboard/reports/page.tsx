"use client";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, CreditCard, Shield, Globe, DollarSign,
  Leaf, BarChart3, ArrowRight, Download,
} from "lucide-react";

const REPORT_TYPES = [
  { title: "Workforce Reports", href: "reports/workforce", icon: Users, desc: "Headcount, turnover, diversity, org metrics", badge: null },
  { title: "Payroll Reports", href: "reports/payroll", icon: CreditCard, desc: "Payroll summaries, statutory, cost analysis", badge: null },
  { title: "Compliance Reports", href: "reports/compliance", icon: Shield, desc: "Audit trails, regulatory compliance status", badge: null },
  { title: "Immigration Reports", href: "reports/immigration", icon: Globe, desc: "Permit status, expiry tracking, FW data", badge: null },
  { title: "Financial Reports", href: "reports/financial", icon: DollarSign, desc: "CAPEX/OPEX, compensation cost centres", badge: null },
  { title: "ESG Reports", href: "reports/esg", icon: Leaf, desc: "Diversity, sustainability, social metrics", badge: "New" },
  { title: "Executive Reports", href: "reports/executive", icon: BarChart3, desc: "Board-level KPIs and strategic summaries", badge: null },
];

export default function ReportsHubPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const nav = (path: string) => router.push(`/${locale}/dashboard/${path}`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate, export and schedule reports across all modules"
        actions={[{ label: "Schedule Report", icon: Download, variant: "outline", onClick: () => {} }]}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {REPORT_TYPES.map((r) => (
          <Card
            key={r.href}
            className="cursor-pointer transition-shadow hover:shadow-md group"
            onClick={() => nav(r.href)}
            role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && nav(r.href)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <r.icon className="size-7 text-[var(--brand)]" />
                {r.badge && <Badge variant="secondary" className="text-[10px]">{r.badge}</Badge>}
              </div>
              <CardTitle className="text-sm mt-2">{r.title}</CardTitle>
              <CardDescription className="text-xs">{r.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs p-0 group-hover:text-[var(--brand)]">
                  Open <ArrowRight className="size-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs p-0 ml-2"
                  onClick={(e) => { e.stopPropagation(); }}>
                  <Download className="size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
