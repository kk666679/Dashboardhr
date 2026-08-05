"use client";
import { useRouter, useParams } from "next/navigation";
import { PageHeader, StatsGrid } from "@/components/layout/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, FileText, CalendarClock, ShieldCheck, Home,
  Truck, Building2, BarChart3, CheckCircle, Clock, ArrowRight, Plus,
} from "lucide-react";

const MODULES = [
  { title: "Worker Directory", href: "foreign-workers/directory", icon: Users, desc: "All foreign worker records & profiles" },
  { title: "Passport Management", href: "permits/passport", icon: FileText, desc: "Track passport validity & renewals" },
  { title: "Permit Management", href: "permits", icon: ShieldCheck, desc: "Work permits, PLKS, special passes" },
  { title: "Visa Renewal", href: "permits/visa-renewal", icon: CalendarClock, desc: "Upcoming renewals & applications" },
  { title: "Quota Management", href: "foreign-workers/quota", icon: BarChart3, desc: "Employer quota allocation & applications" },
  { title: "Levy Management", href: "foreign-workers/levy", icon: CheckCircle, desc: "Levy payments, history & deductions" },
  { title: "FOMEMA Tracking", href: "foreign-workers/fomema", icon: FileText, desc: "Medical examination scheduling & results" },
  { title: "Insurance", href: "foreign-workers/insurance", icon: ShieldCheck, desc: "SPIKPA, PERKESO & protection policies" },
  { title: "Accommodation", href: "accommodation", icon: Home, desc: "Hostel placement & room management" },
  { title: "Transportation", href: "foreign-workers/transport", icon: Truck, desc: "Transport arrangements & tracking" },
  { title: "Agency Management", href: "foreign-workers/agency", icon: Building2, desc: "Recruitment agencies & licenses" },
  { title: "Expiry Calendar", href: "foreign-workers/expiry-calendar", icon: CalendarClock, desc: "All document expiry alerts" },
];

export default function ForeignWorkersPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const nav = (path: string) => router.push(`/${locale}/dashboard/${path}`);

  const stats = [
    { label: "Total Workers", value: "—", icon: Users },
    { label: "Active Permits", value: "—", icon: CheckCircle },
    { label: "Expiring (30d)", value: "—", icon: Clock },
    { label: "Pending Renewals", value: "—", icon: CalendarClock },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Foreign Worker Management"
        description="Complete lifecycle management for foreign workers"
        actions={[
          { label: "New Worker", icon: Plus, variant: "default", onClick: () => nav("foreign-workers/directory") },
        ]}
      />
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MODULES.map((m) => (
          <Card
            key={m.href}
            className="cursor-pointer transition-shadow hover:shadow-md group"
            onClick={() => nav(m.href)}
            role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && nav(m.href)}
          >
            <CardHeader className="pb-2">
              <m.icon className="size-6 text-[var(--brand)]" />
              <CardTitle className="text-sm mt-1">{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[var(--foreground-muted)] mb-3">{m.desc}</p>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs group-hover:text-[var(--brand)] p-0">
                Open <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
