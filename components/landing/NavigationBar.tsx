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
    label: "AI Platform",
    pages: [
      {
        label: "AI Hub",
        href: "/ai",
        subs: [
          { label: "Chat Hub", href: "/ai/chat-hub" },
          { label: "Knowledge Base", href: "/ai/kb-chat" },
          { label: "Semantic Search", href: "/ai/semantic-search" },
          { label: "HR Orchestrator", href: "/ai/hr-orchestrator" },
        ],
      },
      {
        label: "AI Tools",
        href: "/ai/doc-generator",
        subs: [
          { label: "Document Generator", href: "/ai/doc-generator" },
          { label: "Compliance AI", href: "/ai/compliance" },
          { label: "Payroll AI", href: "/ai/payroll" },
          { label: "Recruitment AI", href: "/ai/recruitment" },
          { label: "Employee AI", href: "/ai/employee" },
          { label: "Expat AI", href: "/ai/expat" },
        ],
      },
    ],
  },
  {
    label: "HR & Workforce",
    pages: [
      {
        label: "HR Management",
        href: "/employees",
        subs: [
          { label: "All Employees", href: "/employees" },
          { label: "New Employee", href: "/employees/new" },
          { label: "Onboarding", href: "/employees/onboarding" },
          { label: "Offboarding", href: "/employees/offboarding" },
          { label: "Compensation", href: "/dashboard/compensation" },
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Performance", href: "/dashboard/performance" },
        ],
      },
      {
        label: "Foreign Workers",
        href: "/employees/foreign-workers",
        subs: [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Permits & Visas", href: "/employees/permits" },
          { label: "Medical / FOMEMA", href: "/employees/medical" },
          { label: "Accommodation", href: "/dashboard/accommodation" },
          { label: "Geolocation", href: "/dashboard/geolocation" },
          { label: "Scheduling", href: "/dashboard/scheduling" },
        ],
      },
      {
        label: "Expatriates",
        href: "/employees/expatriates",
        subs: [
          { label: "Expat Dashboard", href: "/employees/expatriates" },
          { label: "Visa Management", href: "/employees/permits" },
        ],
      },
      {
        label: "ESS",
        href: "/ess",
        subs: [
          { label: "Dashboard", href: "/ess" },
          { label: "Profile", href: "/ess/profile" },
          { label: "Payslips", href: "/ess/payslips" },
          { label: "Leave", href: "/ess/leave" },
          { label: "Claims", href: "/ess/claims" },
          { label: "Training", href: "/ess/training" },
        ],
      },
      {
        label: "MSS",
        href: "/mss",
        subs: [
          { label: "Dashboard", href: "/mss" },
          { label: "Team", href: "/mss/team" },
          { label: "Approvals", href: "/mss/approvals" },
          { label: "Attendance", href: "/mss/attendance" },
          { label: "Performance", href: "/mss/performance" },
        ],
      },
    ],
  },
  {
    label: "Finance",
    pages: [
      {
        label: "Accounting",
        href: "/accounting",
        subs: [
          { label: "Dashboard", href: "/accounting" },
          { label: "Invoices", href: "/accounting/invoices" },
          { label: "E-Invoice", href: "/accounting/e-invoice" },
          { label: "Credit Notes", href: "/accounting/credit-notes" },
          { label: "Delivery Orders", href: "/accounting/delivery-orders" },
        ],
      },
      {
        label: "Payroll",
        href: "/accounting/payroll",
        subs: [
          { label: "Payroll Dashboard", href: "/accounting/payroll" },
          { label: "Payroll Calculator", href: "/accounting/payroll-calculator" },
          { label: "Tax Calculator", href: "/accounting/tax-calculator" },
        ],
      },
      {
        label: "Reports",
        href: "/accounting/reports",
        subs: [
          { label: "Financial Reports", href: "/accounting/reports" },
          { label: "Government Submissions", href: "/accounting/government-submissions" },
          { label: "Enhanced Dashboard", href: "/accounting/enhanced" },
        ],
      },
      {
        label: "CAPEX",
        href: "/capex",
        subs: [
          { label: "Overview", href: "/capex" },
          { label: "Assets", href: "/capex/assets" },
          { label: "Projects", href: "/capex/projects" },
          { label: "Budget", href: "/capex/budget" },
          { label: "ROI Analysis", href: "/capex/roi" },
        ],
      },
      {
        label: "OPEX",
        href: "/opex",
        subs: [
          { label: "Overview", href: "/opex" },
          { label: "Lean", href: "/opex/lean" },
          { label: "Six Sigma", href: "/opex/six-sigma" },
          { label: "Kaizen", href: "/opex/kaizen" },
          { label: "Kanban", href: "/opex/kanban" },
          { label: "Analytics", href: "/opex/analytics" },
        ],
      },
    ],
  },
  {
    label: "Operations",
    pages: [
      {
        label: "Automation",
        href: "/automation",
        subs: [
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
        label: "ISO/QMS",
        href: "/iso",
        subs: [
          { label: "Dashboard", href: "/iso" },
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
        label: "Compliance",
        href: "/dashboard/compliance",
        subs: [
          { label: "Compliance Dashboard", href: "/dashboard/compliance" },
          { label: "New Audit", href: "/dashboard/compliance/audit/new" },
          { label: "Compliance AI", href: "/ai/compliance" },
        ],
      },
      {
        label: "Security",
        href: "/dashboard/security",
        subs: [
          { label: "Security Dashboard", href: "/dashboard/security" },
          { label: "Audit Trail", href: "/dashboard/audit-trail" },
          { label: "Data Governance", href: "/dashboard/data-governance" },
        ],
      },
      {
        label: "Documents",
        href: "/dashboard/documents",
        subs: [
          { label: "Document Manager", href: "/dashboard/documents" },
          { label: "PDF Generator", href: "/dashboard/pdf-generator" },
          { label: "AI Document Generator", href: "/ai/doc-generator" },
        ],
      },
    ],
  },
  {
    label: "Analytics",
    pages: [
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        subs: [
          { label: "Analytics Dashboard", href: "/dashboard/analytics" },
          { label: "Automation Analytics", href: "/automation/analytics" },
          { label: "Compliance Dashboard", href: "/iso/compliance-dashboard" },
          { label: "Compliance Score", href: "/iso/compliance-score" },
          { label: "OPEX Analytics", href: "/opex/analytics" },
        ],
      },
      {
        label: "Reports",
        href: "/accounting/reports",
        subs: [
          { label: "Financial Reports", href: "/accounting/reports" },
          { label: "Audit Reports", href: "/iso/audit-generate" },
        ],
      },
    ],
  },
  {
    label: "Integrations & API",
    pages: [
      {
        label: "Integrations",
        href: "/integrations",
        subs: [
          { label: "Overview", href: "/integrations" },
          { label: "Government APIs", href: "/integrations/government" },
          { label: "Agencies Integration", href: "/integrations/government/agencies-integration" },
        ],
      },
      {
        label: "API Platform",
        href: "/integrations",
        subs: [
          { label: "Integrations Hub", href: "/integrations" },
          { label: "Government APIs", href: "/integrations/government" },
          { label: "Agencies Integration", href: "/integrations/government/agencies-integration" },
        ],
      },
    ],
  },
];

export function NavigationBar() {
  const pathname = usePathname();
  const { href: localizedHref, locale } = useLocalizedHref();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
                  className="absolute top-full left-0 mt-1 bg-popover border rounded-xl shadow-2xl overflow-hidden min-w-[600px] grid grid-cols-2 p-2 gap-1"
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

