"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFamily {
  id: string;
  label: string;
  href: string;
  pages: { label: string; href: string; subs?: { label: string; href: string }[] }[];
}

const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    id: "ai",
    label: "AI",
    href: "/ai",
    pages: [
      { label: "AI Hub", href: "/ai" },
      { label: "Chat Hub", href: "/ai/chat-hub" },
      { label: "Knowledge Base", href: "/ai/kb-chat" },
      { label: "Semantic Search", href: "/ai/semantic-search" },
      { label: "HR Orchestrator", href: "/ai/hr-orchestrator" },
      { label: "Document Generator", href: "/ai/doc-generator" },
      { label: "Compliance AI", href: "/ai/compliance" },
      { label: "Recruitment AI", href: "/ai/recruitment" },
    ],
  },
  {
    id: "hr",
    label: "HR",
    href: "/employees",
    pages: [
      { label: "Employees", href: "/employees" },
      { label: "Onboarding", href: "/employees/onboarding" },
      { label: "Offboarding", href: "/employees/offboarding" },
      { label: "Foreign Workers", href: "/employees/foreign-workers" },
      { label: "Expatriates", href: "/employees/expatriates" },
      { label: "Compensation", href: "/dashboard/compensation" },
      { label: "Recruitment", href: "/dashboard/recruitment" },
      { label: "Performance", href: "/dashboard/performance" },
    ],
  },
  {
    id: "workforce",
    label: "Workforce",
    href: "/employees/foreign-workers",
    pages: [
      { label: "Worker Dashboard", href: "/dashboard" },
      { label: "Permits & Visas", href: "/employees/permits" },
      { label: "Medical / FOMEMA", href: "/employees/medical" },
      { label: "Accommodation", href: "/dashboard/accommodation" },
      { label: "Geolocation", href: "/dashboard/geolocation" },
      { label: "Scheduling", href: "/dashboard/scheduling" },
      { label: "ESS Portal", href: "/ess" },
      { label: "MSS Portal", href: "/mss" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    href: "/accounting",
    pages: [
      { label: "Dashboard", href: "/accounting" },
      { label: "Invoices", href: "/accounting/invoices" },
      { label: "E-Invoice", href: "/accounting/e-invoice" },
      { label: "Payroll", href: "/accounting/payroll" },
      { label: "Payroll Calculator", href: "/accounting/payroll-calculator" },
      { label: "Tax Calculator", href: "/accounting/tax-calculator" },
      { label: "Financial Reports", href: "/accounting/reports" },
      { label: "Government Submissions", href: "/accounting/government-submissions" },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    href: "/automation",
    pages: [
      { label: "Overview", href: "/automation" },
      { label: "Flow Designer", href: "/automation/designer" },
      { label: "Workflow Engine", href: "/automation/workflow-engine" },
      { label: "QMS / Quality", href: "/automation/qms" },
      { label: "SOP Workflows", href: "/automation/sops" },
      { label: "Templates", href: "/automation/templates" },
      { label: "Analytics", href: "/automation/analytics" },
    ],
  },
  {
    id: "iso",
    label: "ISO",
    href: "/iso",
    pages: [
      { label: "ISO Dashboard", href: "/iso" },
      { label: "Audit Checklist", href: "/iso/audit-checklist" },
      { label: "Create Audit Plan", href: "/iso/audit-create-plan" },
      { label: "Generate Audit", href: "/iso/audit-generate" },
      { label: "CAPA", href: "/iso/capa-create" },
      { label: "Compliance Check", href: "/iso/compliance-check" },
      { label: "Gap Analysis", href: "/iso/gap-analysis" },
      { label: "Fishbone", href: "/iso/fishbone" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    pages: [
      { label: "Analytics Dashboard", href: "/dashboard/analytics" },
      { label: "Financial Reports", href: "/accounting/reports" },
      { label: "Automation Analytics", href: "/automation/analytics" },
      { label: "Compliance Dashboard", href: "/iso/compliance-dashboard" },
      { label: "Compliance Score", href: "/iso/compliance-score" },
      { label: "OPEX Analytics", href: "/opex/analytics" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    href: "/integrations",
    pages: [
      { label: "Overview", href: "/integrations" },
      { label: "Government APIs", href: "/integrations/government" },
      { label: "OpenAPI", href: "/api/openapi" },
      { label: "HR Integration", href: "/api/hr-integration" },
    ],
  },
  {
    id: "api",
    label: "API",
    href: "/integrations",
    pages: [
      { label: "Integrations Hub", href: "/integrations" },
      { label: "Government APIs", href: "/integrations/government" },
      { label: "Agencies Integration", href: "/integrations/government/agencies-integration" },
    ],
  },
];

export function EnterpriseHeader() {
  const { href: localizedHref, locale } = useLocalizedHref();
  const [scrolled, setScrolled] = useState(false);

  // Localize all product family + page hrefs
  const localizeFamilies = (families: ProductFamily[]): ProductFamily[] =>
    families.map((family) => ({
      ...family,
      href: localizedHref(family.href),
      pages: family.pages.map((page) => ({
        ...page,
        href: localizedHref(page.href),
        subs: page.subs?.map((sub) => ({ ...sub, href: localizedHref(sub.href) })),
      })),
    }));

  const families = localizeFamilies(PRODUCT_FAMILIES);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!activeDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDropdown]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href={localizedHref("/")} className="flex items-center gap-2 flex-shrink-0">
            <Logo width={36} height={36} className="rounded-lg" />
            <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AiFWMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {families.map((family) => (
              <div
                key={family.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(family.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={family.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-1">
                    {family.label}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </span>
                </Link>

                <AnimatePresence>
                  {activeDropdown === family.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-1 w-56 rounded-xl border bg-popover shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        {family.pages.map((page) => (
                          <Link
                            key={page.href}
                            href={page.href}
                            className="block px-3 py-2 rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {page.label}
                          </Link>
                        ))}
                        <div className="border-t mt-2 pt-2">
                          <Link
                            href={family.href}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            View all {family.label} →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            <Button variant="default" size="sm" className="hidden sm:inline-flex gap-2" asChild>
              <Link href={localizedHref("/login")}>
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>

            <Button variant="default" size="sm" className="sm:hidden" asChild>
              <Link href={localizedHref("/login")}>Login</Link>
            </Button>

            {/* Mobile menu trigger */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-[80vh] overflow-y-auto px-4 py-4 space-y-1">
              {PRODUCT_FAMILIES.map((family) => (
                <div key={family.id}>
                  <Link
                    href={family.href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => {
                      setMobileOpen(false);
                      setActiveDropdown(null);
                    }}
                  >
                    {family.label}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Link>
                  <div className="ml-4 space-y-0.5 mb-2">
                    {family.pages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {page.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <Button className="w-full gap-2" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}