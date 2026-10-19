"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";

interface SubPage {
  label: string;
  href: string;
}

interface NavPage {
  label: string;
  href: string;
  subs?: SubPage[];
}

interface NavSection {
  label: string;
  pages: NavPage[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Solutions",
    pages: [
      { label: "Improve Employee Experience", href: "/employees", subs: [
        { label: "Employee Directory", href: "/employees" },
        { label: "Employee Self-Service", href: "/ess" },
      ] },
      { label: "Reduce Workforce Cost and Risk", href: "/dashboard/analytics", subs: [
        { label: "Analytics and Decision Intelligence", href: "/dashboard/analytics" },
        { label: "Compliance", href: "/dashboard/compliance" },
      ] },
      { label: "Streamline HR Operations", href: "/automation", subs: [
        { label: "Workflow Automation", href: "/automation" },
        { label: "Payroll", href: "/accounting/payroll" },
      ] },
      { label: "Run Efficient Workplace Operations", href: "/dashboard/accommodation", subs: [
        { label: "Accommodation", href: "/dashboard/accommodation" },
        { label: "Geolocation", href: "/dashboard/geolocation" },
      ] },
      { label: "Ensure Foreign Worker Compliance", href: "/employees/foreign-workers", subs: [
        { label: "Foreign Workers", href: "/employees/foreign-workers" },
        { label: "Permits and Medical", href: "/employees/permits" },
      ] },
    ],
  },
  {
    label: "Platform",
    pages: [
      { label: "Workflow Automation", href: "/automation", subs: [
        { label: "Workflow Engine", href: "/automation/workflow-engine" },
        { label: "Flow Designer", href: "/automation/designer" },
      ] },
      { label: "Analytics and Decision Intelligence", href: "/dashboard/analytics", subs: [
        { label: "Analytics Dashboard", href: "/dashboard/analytics" },
        { label: "Automation Analytics", href: "/automation/analytics" },
      ] },
      { label: "Integrations", href: "/integrations", subs: [
        { label: "Integration Hub", href: "/integrations" },
        { label: "Accounting", href: "/dashboard/integrations/accounting" },
      ] },
      { label: "Security, Privacy, and Governance", href: "/dashboard/security", subs: [
        { label: "Security", href: "/dashboard/security" },
        { label: "Data Governance", href: "/dashboard/data-governance" },
      ] },
      { label: "Developer Platform", href: "/integrations", subs: [
        { label: "API Platform", href: "/integrations" },
        { label: "API Reference", href: "/integrations" },
      ] },
    ],
  },
  {
    label: "By Role",
    pages: [
      { label: "HR Leaders", href: "/dashboard/dashboards/hr" },
      { label: "Finance Leaders", href: "/dashboard/dashboards/payroll" },
      { label: "Operations Leaders", href: "/dashboard/dashboards/executive" },
      { label: "IT Leaders", href: "/dashboard/security" },
      { label: "Developers", href: "/integrations" },
    ],
  },
  {
    label: "Customers",
    pages: [
      { label: "Customer Stories", href: "/" },
      { label: "Industries", href: "/" },
      { label: "ROI and Outcomes", href: "/dashboard/analytics" },
    ],
  },
  {
    label: "Resources",
    pages: [
      { label: "Guides and Reports", href: "/accounting/reports" },
      { label: "Implementation Resources", href: "/automation/templates" },
      { label: "Help Center & Documentation", href: "/dashboard/help" },
      { label: "Malaysian Labor Law Guide", href: "/ai/kb-chat" },
      { label: "API Reference", href: "/integrations" },
    ],
  },
];

export function NavigationBar() {
  const pathname = usePathname();
  const { href: localizedHref, locale } = useLocalizedHref();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedSection(null);
        setExpandedPage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    const localized = localizedHref(href);
    return pathname === localized || pathname.startsWith(localized + "/");
  };

  // Localize all section/page/sub hrefs
  const localize = (nav: NavSection[]): NavSection[] =>
    nav.map((section) => ({
      ...section,
      pages: section.pages.map((page) => ({
        ...page,
        href: localizedHref(page.href),
        subs: page.subs?.map((sub) => ({ ...sub, href: localizedHref(sub.href) })),
      })),
    }));

  const NAV = localize(NAV_SECTIONS);

  return (
    <nav className="w-full">
      {/* Desktop horizontal nav */}
      <div className="hidden lg:flex flex-wrap gap-1">
        {NAV.map((section) => (
          <div
            key={section.label}
            className="relative"
            onMouseEnter={() => setExpandedSection(section.label)}
            onMouseLeave={() => setExpandedSection(null)}
          >
            <button
              type="button"
              aria-expanded={expandedSection === section.label}
              aria-haspopup="true"
              onClick={() => setExpandedSection(expandedSection === section.label ? null : section.label)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
                "hover:bg-accent hover:text-accent-foreground",
                section.pages.some((p) => isActive(p.href))
                  ? "text-foreground bg-accent/50"
                  : "text-muted-foreground",
              )}
            >
              {section.label}
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </button>

            <AnimatePresence>
              {expandedSection === section.label && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-[calc(100%+0.25rem)] z-50 max-w-[min(42rem,calc(100vw-2rem))] min-w-[min(37.5rem,calc(100vw-2rem))] overflow-hidden rounded-xl border bg-popover p-2 shadow-2xl grid grid-cols-2 gap-1"
                >
                  {section.pages.map((page) => (
                    <div key={page.href} className="rounded-lg p-2 hover:bg-accent/50 transition-colors">
                      <Link
                        href={page.href}
                        className="block font-medium text-sm text-foreground mb-1 px-2 py-1 rounded-md hover:text-primary transition-colors"
                        onClick={() => setExpandedSection(null)}
                      >
                        {page.label}
                      </Link>
                      {page.subs && (
                        <div className="space-y-0.5">
                          {page.subs.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "block px-2 py-1 rounded-md text-xs transition-colors",
                                isActive(sub.href)
                                  ? "text-primary bg-primary/10 font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                              )}
                              onClick={() => setExpandedSection(null)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Mobile accordion nav */}
      <div className="lg:hidden space-y-1">
        {NAV.map((section) => (
          <div key={section.label}>
            <button
              onClick={() =>
                setExpandedSection(expandedSection === section.label ? null : section.label)
              }
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent",
                section.pages.some((p) => isActive(p.href))
                  ? "text-foreground bg-accent/50"
                  : "text-muted-foreground",
              )}
            >
              {section.label}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  expandedSection === section.label && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {expandedSection === section.label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 space-y-0.5 py-1">
                    {section.pages.map((page) => (
                      <div key={page.href}>
                        <button
                          onClick={() =>
                            setExpandedPage(expandedPage === page.href ? null : page.href)
                          }
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                            "hover:bg-accent",
                            isActive(page.href)
                              ? "text-primary font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          <span>{page.label}</span>
                          {page.subs && (
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 transition-transform duration-200",
                                expandedPage === page.href && "rotate-180",
                              )}
                            />
                          )}
                        </button>

                        {page.subs && expandedPage === page.href && (
                          <div className="ml-4 space-y-0.5 py-0.5">
                            {page.subs.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  "block px-3 py-1.5 rounded-lg text-sm transition-colors",
                                  isActive(sub.href)
                                    ? "text-primary bg-primary/10 font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                                )}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  );
}

