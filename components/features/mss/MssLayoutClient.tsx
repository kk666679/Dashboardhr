"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users, Calendar, BarChart2, CheckSquare,
  AlertTriangle, TrendingUp, Home,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/mss", label: "Dashboard", icon: Home },
  { href: "/mss/team", label: "My Team", icon: Users },
  { href: "/mss/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/mss/attendance", label: "Attendance", icon: Calendar },
  { href: "/mss/performance", label: "Performance", icon: TrendingUp },
  { href: "/mss/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/mss/incidents", label: "Incidents", icon: AlertTriangle },
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
          <nav className="px-2 py-3 space-y-0.5" aria-label="MSS navigation">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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
                  {label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--sidebar-border)] p-2 space-y-2">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src="/women.png" alt="User avatar" />
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
            <AvatarImage src="/women.png" alt="User avatar" />
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
          {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
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
