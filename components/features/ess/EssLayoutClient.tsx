"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, FileText, DollarSign, User, Briefcase, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/ess",          label: "Home",     icon: Home },
  { href: "/ess/leave",    label: "Leave",    icon: Calendar },
  { href: "/ess/payslips", label: "Payslips", icon: DollarSign },
  { href: "/ess/claims",   label: "Claims",   icon: FileText },
  { href: "/ess/training", label: "Training", icon: BookOpen },
  { href: "/ess/assets",   label: "Assets",   icon: Briefcase },
  { href: "/ess/profile",  label: "Profile",  icon: User },
];

export function EssLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="glass-navbar flex h-14 items-center gap-3 px-4 sticky top-0 z-50" role="banner">
          <Image src="/logo.svg" alt="AiFWMS" width={28} height={28} className="shrink-0" priority />
          <span className="font-bold text-base">My HR</span>
          <span className="text-xs text-[var(--foreground-subtle)] ml-1">Employee Portal</span>
          <div className="flex-1" />
          <ThemeToggle />
          <Avatar className="size-7">
            <AvatarImage src="/Avatar-woman.png" alt="User avatar" />
            <AvatarFallback className="text-xs bg-[var(--brand-muted)] text-[var(--brand)]">E</AvatarFallback>
          </Avatar>
        </header>

        {/* Content */}
        <main
          id="ess-main"
          className="flex-1 overflow-y-auto bg-[var(--background-subtle)] pb-20"
          role="main"
        >
          {children}
        </main>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--background)] z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
          aria-label="ESS navigation"
        >
          <div className="grid grid-cols-7 h-16">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/ess" && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 transition-colors",
                    isActive
                      ? "text-[var(--brand)] font-medium"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
