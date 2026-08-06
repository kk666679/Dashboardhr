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
    id: "solutions",
    label: "Solutions",
    href: "/employees/foreign-workers",
    pages: [
      { label: "Improve employee experience", href: "/ess" },
      { label: "Reduce workforce cost and risk", href: "/accounting/payroll" },
      { label: "Streamline HR operations", href: "/employees" },
      { label: "Run efficient workplace operations", href: "/dashboard/geolocation" },
      { label: "Ensure foreign worker compliance", href: "/employees/foreign-workers" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    href: "/automation",
    pages: [
      { label: "Workflow automation", href: "/automation" },
      { label: "Analytics and decision intelligence", href: "/dashboard/analytics" },
      { label: "Integrations", href: "/integrations" },
      { label: "Security, privacy, and governance", href: "/dashboard/security" },
      { label: "Developer platform", href: "/api/openapi" },
    ],
  },
  {
    id: "by-role",
    label: "By role",
    href: "/employees",
    pages: [
      { label: "HR leaders", href: "/employees" },
      { label: "Finance leaders", href: "/accounting" },
      { label: "Operations leaders", href: "/dashboard/geolocation" },
      { label: "IT leaders", href: "/integrations" },
      { label: "Developers", href: "/api/openapi" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    href: "/dashboard",
    pages: [
      { label: "Customer stories", href: "/dashboard" },
      { label: "Industries", href: "/dashboard" },
      { label: "ROI and outcomes", href: "/dashboard" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    href: "/ai/kb-chat",
    pages: [
      { label: "Guides and reports", href: "/ai/kb-chat" },
      { label: "Implementation resources", href: "/automation/templates" },
      { label: "Help center / documentation", href: "/ai/semantic-search" },
      { label: "Malaysian labor law guide", href: "/ai/hr-orchestrator" },
      { label: "API reference", href: "/api/openapi" },
    ],
  },
];

export function EnterpriseHeader() {
  const { href: localizedHref } = useLocalizedHref();
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          ? "bg-[#071827]/95 backdrop-blur-xl border-b border-[#23415c]/60 shadow-[0_12px_40px_rgba(2,10,22,0.35)]"
          : "bg-[#071827]/90 backdrop-blur-xl border-b border-[#23415c]/40",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href={localizedHref("/")} className="flex items-center gap-2 flex-shrink-0">
            <Logo width={36} height={36} className="rounded-lg" />
            <span className="font-bold text-lg hidden sm:block text-white">
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
                    "hover:bg-[#17324f] hover:text-white",
                    "text-slate-100/90",
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
                      className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-[#23415c] bg-[#10263f] shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        {family.pages.map((page, idx) => (
                          <Link
                            key={`${page.href}-${idx}`}
                            href={page.href}
                            className="block px-3 py-2 rounded-lg text-sm hover:bg-[#17324f] hover:text-white transition-colors text-slate-200/90"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {page.label}
                          </Link>
                        ))}
                        <div className="border-t mt-2 pt-2">
                          <Link
                            href={family.href}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-[#7dd3fc] hover:bg-[#17324f] hover:text-white transition-colors"
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

            <Link
              href={localizedHref("/dashboard/settings/pricing")}
              className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-[#7dd3fc] hover:text-[#f5b041] transition-colors"
            >
              Pricing
            </Link>

            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex gap-2 bg-[#e67e22] text-white hover:bg-[#cf6413] shadow-[0_12px_30px_rgba(230,126,34,0.25)]"
              asChild
            >
              <Link href={localizedHref("/dashboard")}>
                Request a demo
              </Link>
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1 text-[#7dd3fc] hover:text-white hover:bg-[#17324f]" asChild>
              <Link href={localizedHref("/login")}>
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            </Button>

            <Button variant="default" size="sm" className="sm:hidden bg-[#e67e22] text-white hover:bg-[#cf6413]" asChild>
              <Link href={localizedHref("/login")}>Log in</Link>
            </Button>

            {/* Mobile menu trigger */}
            <button
              className="lg:hidden p-2 rounded-md text-white hover:bg-[#17324f]"
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
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#17324f] transition-colors"
                    onClick={() => {
                      setMobileOpen(false);
                      setActiveDropdown(null);
                    }}
                  >
                    {family.label}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Link>
                  <div className="ml-4 space-y-0.5 mb-2">
                    {family.pages.map((page, idx) => (
                      <Link
                        key={`${page.href}-${idx}`}
                        href={page.href}
                        className="block px-3 py-2 rounded-lg text-sm text-slate-200/90 hover:bg-[#17324f] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {page.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <Button className="w-full gap-2 bg-[#3498db] text-white hover:bg-[#267db8]" asChild>
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