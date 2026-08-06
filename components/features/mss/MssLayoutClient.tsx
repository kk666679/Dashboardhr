"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users, Calendar, BarChart2, CheckSquare,
  TrendingUp, Home, Brain, Zap, Target,
  Heart, Lightbulb, Sparkles, GraduationCap,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const NAV_SECTIONS = [
  {
    label: "Command",
    items: [
      { href: "/mss", label: "Dashboard", icon: Home },
      { href: "/mss/command-center", label: "Command Center", icon: Zap, badge: "AI" },
      { href: "/mss/ai-assistant", label: "AI Assistant", icon: Brain, badge: "New" },
    ],
  },
  {
    label: "Team",
    items: [
      { href: "/mss/team", label: "My Team", icon: Users },
      { href: "/mss/approvals", label: "Approvals", icon: CheckSquare },
      { href: "/mss/attendance", label: "Attendance", icon: Calendar },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/mss/workforce-planning", label: "Workforce Planning", icon: Lightbulb },
      { href: "/mss/analytics", label: "Analytics", icon: BarChart2 },
      { href: "/mss/experience", label: "Experience", icon: Heart },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/mss/performance", label: "Performance", icon: TrendingUp },
      { href: "/mss/feedback", label: "Feedback", icon: Target },
      { href: "/mss/talent", label: "Talent & Growth", icon: GraduationCap },
    ],
  },
];

// Flat list for mobile nav
const MOBILE_NAV = [
  { href: "/mss", label: "Home", icon: Home },
  { href: "/mss/command-center", label: "Command", icon: Zap },
  { href: "/mss/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/mss/ai-assistant", label: "AI", icon: Brain },
  { href: "/mss/analytics", label: "Analytics", icon: BarChart2 },
];

export function MssLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)]">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-[var(--sidebar-border)] px-3">
          <Image src="/logo.svg" alt="AiFWMS" width={28} height={28} className="shrink-0" priority />
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">AiFWMS</p>
            <p className="text-[10px] text-[var(--foreground-subtle)] truncate">Manager Portal</p>
          </div>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1">
          <nav className="px-2 py-3 space-y-4" aria-label="MSS navigation">
            {NAV_SECTIONS.map(({ label: sectionLabel, items }) => (
              <div key={sectionLabel}>
                <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                  {sectionLabel}
                </p>
                <div className="space-y-0.5">
                  {items.map(({ href, label, icon: Icon, badge }: { href: string; label: string; icon: React.ElementType; badge?: string }) => {
                    const isActive = pathname === href || (href !== "/mss" && pathname?.startsWith(href));
                    return (
                      <Link
                        key={href}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 px-2 h-8 rounded-[var(--radius-md)] text-sm font-[450]",
                          "transition-colors duration-100",
                          isActive
                            ? "bg-[var(--brand-muted)] text-[var(--brand)] font-medium"
                            : "text-[var(--foreground-muted)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]",
                        )}
                      >
                        <Icon className="size-[1.0625rem] shrink-0" aria-hidden="true" />
                        <span className="flex-1 truncate">{label}</span>
                        {badge && (
                          <Badge className="h-4 text-[9px] px-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-0">
                            {badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--sidebar-border)] p-2 space-y-2">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src="/Avatar-woman.png" alt="User avatar" />
              <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">M</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Manager</p>
              <p className="text-[11px] text-[var(--foreground-subtle)] truncate">manager@aifwms.xyz</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="glass-navbar flex h-14 items-center gap-3 px-4 md:px-5" role="banner">
          <span className="font-bold text-base">Manager Self-Service</span>
          <div className="flex-1" />
          <ThemeToggle />
          <Avatar className="size-7">
            <AvatarImage src="/Avatar-woman.png" alt="User avatar" />
            <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">M</AvatarFallback>
          </Avatar>
        </header>

        {/* Content */}
        <main
          id="mss-main"
          className="flex-1 overflow-y-auto bg-[var(--background-subtle)]"
          role="main"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-5 md:px-6 md:py-6">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--background)] flex md:hidden justify-around py-1" aria-label="Mobile navigation">
          {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/mss" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center py-1 px-2 text-xs",
                  isActive ? "text-[var(--brand)] font-medium" : "text-[var(--foreground-muted)]",
                )}
              >
                <Icon className="size-5 mb-0.5" />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
