"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Workflow, Play, Shield, FileText, BarChart3, GitBranch } from "lucide-react";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

const navigationItems = [
  { href: ROUTE.dashboard.automation.root, label: "Hub", icon: Home },
  { href: ROUTE.dashboard.automation.designer, label: "Designer", icon: Workflow },
  { href: ROUTE.dashboard.automation.monitor, label: "Monitor", icon: Play },
  { href: ROUTE.dashboard.automation.qms, label: "QMS", icon: Shield },
  { href: ROUTE.dashboard.automation.sop, label: "SOPs", icon: FileText },
  { href: ROUTE.dashboard.automation.analytics, label: "Analytics", icon: BarChart3 },
  { href: ROUTE.dashboard.automation.templates, label: "Templates", icon: GitBranch },
] as const;

export function AutomationNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Automation navigation" className="flex items-center gap-2 p-2 bg-background border-b flex-wrap">
      {navigationItems.map(({ href, label, icon: Icon }) => (
        <Button key={href} variant={pathname === href ? "secondary" : "ghost"} size="sm" asChild>
          <Link href={href} aria-current={pathname === href ? "page" : undefined}>
            <Icon className="h-4 w-4 mr-1" /> {label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
