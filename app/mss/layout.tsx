/**
 * MSS Portal Layout — Sprint 18
 * Manager Self-Service shell with team-focused navigation.
 * Requirements: 15.1
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Users, Calendar, BarChart2, CheckSquare,
  ClipboardList, AlertTriangle, TrendingUp, Home
} from "lucide-react";

export const metadata: Metadata = {
  title: "Manager Self-Service",
  description: "Team management, approvals, and analytics",
};

const NAV_ITEMS = [
  { href: "/mss",              label: "Dashboard",   icon: Home },
  { href: "/mss/team",         label: "My Team",     icon: Users },
  { href: "/mss/approvals",    label: "Approvals",   icon: CheckSquare },
  { href: "/mss/attendance",   label: "Attendance",  icon: Calendar },
  { href: "/mss/performance",  label: "Performance", icon: TrendingUp },
  { href: "/mss/analytics",    label: "Analytics",   icon: BarChart2 },
  { href: "/mss/incidents",    label: "Incidents",   icon: AlertTriangle },
];

export default function MssLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-40 h-14 flex items-center px-4 gap-3">
        <span className="font-bold text-primary text-lg">HCM MSS</span>
        <span className="text-xs text-muted-foreground ml-auto">Manager Self-Service</span>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-56 border-r bg-white min-h-[calc(100vh-3.5rem)] p-3 fixed top-14 bottom-0">
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground hover:text-foreground">
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 md:ml-56 p-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="sticky bottom-0 border-t bg-white flex md:hidden">
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className="flex-1 flex flex-col items-center py-2 text-xs text-muted-foreground hover:text-primary">
            <Icon className="h-5 w-5 mb-0.5" />{label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
