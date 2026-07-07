/**
 * ESS (Employee Self-Service) Portal Layout — Task 17.1
 *
 * Minimal navigation shell with PWA support.
 * Full feature parity between web and mobile (Req 14.1).
 *
 * Requirements: 14.1
 */

import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Home, Calendar, FileText, DollarSign, User, Briefcase, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "My HR — Employee Self-Service",
  description: "Employee self-service portal",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "My HR" },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

const NAV_ITEMS = [
  { href: "/ess",           label: "Home",      icon: Home },
  { href: "/ess/leave",     label: "Leave",     icon: Calendar },
  { href: "/ess/payslips",  label: "Payslips",  icon: DollarSign },
  { href: "/ess/claims",    label: "Claims",    icon: FileText },
  { href: "/ess/training",  label: "Training",  icon: BookOpen },
  { href: "/ess/assets",    label: "Assets",    icon: Briefcase },
  { href: "/ess/profile",   label: "Profile",   icon: User },
];

export default function EssLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <span className="font-bold text-lg tracking-tight">My HR</span>
        <span className="text-xs text-slate-400">Employee Portal</span>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="grid grid-cols-7 h-16">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
