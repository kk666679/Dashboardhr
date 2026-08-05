"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Shield,
  Settings,
  FileText,
  BarChart3,
  Search,
  ArrowRight,
  Command as CommandIcon,
  Sparkles,
  MessageSquare,
  UserPlus,
  Briefcase,
  GraduationCap,
  Clock,
  Plane,
  Building,
  MapPin,
  Bell,
  User,
  LogOut,
  HelpCircle,
  Keyboard,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Badge } from "@/components/ui/badge";
import { DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useRegisteredCommandGroups,
  type CommandCategory,
  type RegisteredCommandGroup,
  type RegisteredCommandItem,
} from "./command-registry";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommandItem = RegisteredCommandItem;

export interface CommandGroup extends Omit<RegisteredCommandGroup, "id"> {}

export interface CommandPaletteProps {
  /** Extra command groups to register (domain-specific) */
  extraGroups?: CommandGroup[];
  /** Whether the palette is open */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Keyboard shortcut (default: "k") */
  shortcutKey?: string;
  /** Whether to show recently viewed items */
  showRecent?: boolean;
  /** Class name for the dialog */
  className?: string;
}

// ─── Command Groups ──────────────────────────────────────────────────────────

function usePageCommands(): CommandGroup[] {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const l = (p: string) => `/${locale}${p}`;

  return useMemo(
    () => [
      {
        category: "Navigation",
        items: [
          { id: "nav-dashboard",       title: "Dashboard",              subtitle: "HR overview",                   icon: LayoutDashboard, keywords: ["home","main"],                        category: "Navigation", action: () => router.push(l("/dashboard")) },
          { id: "nav-analytics",       title: "Analytics",              subtitle: "HR metrics and charts",         icon: BarChart3,       keywords: ["metrics","statistics"],              category: "Navigation", action: () => router.push(l("/dashboard/analytics")) },
          { id: "nav-dashboards",      title: "Dashboards",             subtitle: "All role dashboards",           icon: BarChart3,       keywords: ["executive","hr","compliance"],        category: "Navigation", action: () => router.push(l("/dashboard/dashboards")) },
          { id: "nav-reports",         title: "Reports",                subtitle: "All report types",              icon: FileText,        keywords: ["export","report"],                   category: "Navigation", action: () => router.push(l("/dashboard/reports")) },
          { id: "nav-employees",       title: "Employees",              subtitle: "Employee directory",            icon: Users,           keywords: ["staff","people","directory"],         category: "Navigation", action: () => router.push(l("/dashboard/employees")) },
          { id: "nav-foreign-workers", title: "Foreign Workers",        subtitle: "FW management hub",             icon: Users,           keywords: ["fwms","foreign","worker","permit"],   category: "Navigation", action: () => router.push(l("/dashboard/foreign-workers")) },
          { id: "nav-expatriates",     title: "Expatriates",            subtitle: "Expat assignment management",   icon: BarChart3,       keywords: ["expat","assignment","global"],        category: "Navigation", action: () => router.push(l("/dashboard/expatriates")) },
          { id: "nav-payroll",         title: "Payroll",                subtitle: "Payroll processing",            icon: CreditCard,      keywords: ["salary","wages","epf","socso"],       category: "Navigation", action: () => router.push(l("/dashboard/payroll")) },
          { id: "nav-leave",           title: "Leave Management",       subtitle: "Leave requests and balances",   icon: Calendar,        keywords: ["vacation","sick","time off"],         category: "Navigation", action: () => router.push(l("/dashboard/leave")) },
          { id: "nav-attendance",      title: "Attendance",             subtitle: "Biometric and shift tracking",  icon: Clock,           keywords: ["clock","biometric","shift"],          category: "Navigation", action: () => router.push(l("/dashboard/attendance")) },
          { id: "nav-compliance",      title: "Compliance",             subtitle: "Regulatory compliance",         icon: Shield,          keywords: ["audit","regulation","legal"],         category: "Navigation", action: () => router.push(l("/dashboard/compliance")) },
          { id: "nav-permits",         title: "Permits & Visas",        subtitle: "Permit lifecycle management",   icon: Shield,          keywords: ["visa","plks","permit","renew"],       category: "Navigation", action: () => router.push(l("/dashboard/permits")) },
          { id: "nav-documents",       title: "Documents",              subtitle: "Document management",           icon: FileText,        keywords: ["file","contract","upload","ocr"],     category: "Navigation", action: () => router.push(l("/dashboard/documents")) },
          { id: "nav-recruitment",     title: "Recruitment",            subtitle: "Hiring pipeline",               icon: Briefcase,       keywords: ["hire","job","vacancy","candidate"],   category: "Navigation", action: () => router.push(l("/dashboard/recruitment")) },
          { id: "nav-onboarding",      title: "Onboarding",             subtitle: "New employee onboarding",       icon: UserPlus,        keywords: ["new hire","orientation","induction"], category: "Navigation", action: () => router.push(l("/dashboard/onboarding")) },
          { id: "nav-performance",     title: "Performance",            subtitle: "Reviews and goals",             icon: BarChart3,       keywords: ["review","appraisal","goals","kpi"],   category: "Navigation", action: () => router.push(l("/dashboard/performance")) },
          { id: "nav-learning",        title: "Learning & Development", subtitle: "Training and courses",          icon: GraduationCap,   keywords: ["training","courses","lms","skills"],  category: "Navigation", action: () => router.push(l("/dashboard/learning-development")) },
          { id: "nav-workflows",       title: "Workflows",              subtitle: "Approval and automation flows", icon: Settings,        keywords: ["approval","workflow","automation"],   category: "Navigation", action: () => router.push(l("/dashboard/workflows")) },
          { id: "nav-settings",        title: "Settings",               subtitle: "System configuration",          icon: Settings,        keywords: ["config","preferences"],              category: "Navigation", shortcut: "⌘,", action: () => router.push(l("/dashboard/settings")) },
        ],
      },
      {
        category: "Dashboards",
        items: [
          { id: "db-executive",  title: "Executive Dashboard",      icon: LayoutDashboard, keywords: ["executive","ceo","board"],       category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/executive")) },
          { id: "db-hr",         title: "HR Dashboard",             icon: Users,           keywords: ["hr","human resources"],         category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/hr")) },
          { id: "db-compliance", title: "Compliance Dashboard",     icon: Shield,          keywords: ["compliance","audit"],           category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/compliance")) },
          { id: "db-immigr",     title: "Immigration Dashboard",    icon: BarChart3,       keywords: ["immigration","visa","permit"],  category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/immigration")) },
          { id: "db-payroll",    title: "Payroll Dashboard",        icon: CreditCard,      keywords: ["payroll","salary"],            category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/payroll")) },
          { id: "db-fw",         title: "Foreign Worker Dashboard", icon: Users,           keywords: ["foreign","worker"],            category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/foreign-worker")) },
          { id: "db-expat",      title: "Expatriate Dashboard",     icon: BarChart3,       keywords: ["expat","assignment"],          category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/expatriate")) },
          { id: "db-aiops",      title: "AI Operations Dashboard",  icon: Sparkles,        keywords: ["ai","agents","automation"],    category: "Dashboards", action: () => router.push(l("/dashboard/dashboards/ai-ops")) },
        ],
      },
      {
        category: "Reports",
        items: [
          { id: "rpt-workforce",   title: "Workforce Report",   icon: Users,      keywords: ["headcount","turnover","diversity"], category: "Reports", action: () => router.push(l("/dashboard/reports/workforce")) },
          { id: "rpt-payroll",     title: "Payroll Report",     icon: CreditCard, keywords: ["salary","statutory","epf"],        category: "Reports", action: () => router.push(l("/dashboard/reports/payroll")) },
          { id: "rpt-compliance",  title: "Compliance Report",  icon: Shield,     keywords: ["audit","regulatory"],              category: "Reports", action: () => router.push(l("/dashboard/reports/compliance")) },
          { id: "rpt-immigration", title: "Immigration Report", icon: FileText,   keywords: ["visa","permit","expiry"],          category: "Reports", action: () => router.push(l("/dashboard/reports/immigration")) },
          { id: "rpt-financial",   title: "Financial Report",   icon: CreditCard, keywords: ["capex","opex","cost"],             category: "Reports", action: () => router.push(l("/dashboard/reports/financial")) },
          { id: "rpt-esg",         title: "ESG Report",         icon: BarChart3,  keywords: ["esg","sustainability"],            category: "Reports", action: () => router.push(l("/dashboard/reports/esg")) },
          { id: "rpt-executive",   title: "Executive Report",   icon: BarChart3,  keywords: ["board","executive","summary"],     category: "Reports", action: () => router.push(l("/dashboard/reports/executive")) },
        ],
      },
      {
        category: "Actions",
        items: [
          { id: "act-new-employee",  title: "New Employee",          icon: UserPlus,   keywords: ["hire","add employee"],           category: "Actions", action: () => router.push(l("/dashboard/employees/new")) },
          { id: "act-apply-leave",   title: "Apply Leave",           icon: Calendar,   keywords: ["leave request","time off"],      category: "Actions", action: () => router.push(l("/dashboard/leave/apply")) },
          { id: "act-run-payroll",   title: "Run Payroll",           icon: CreditCard, keywords: ["process payroll","salary run"],  category: "Actions", action: () => router.push(l("/dashboard/payroll/run")) },
          { id: "act-new-audit",     title: "New Compliance Audit",  icon: Shield,     keywords: ["audit","compliance check"],      category: "Actions", action: () => router.push(l("/dashboard/compliance/audit/new")) },
          { id: "act-renew-permit",  title: "Renew Permit",          icon: Shield,     keywords: ["permit renewal","visa renew"],   category: "Actions", action: () => router.push(l("/dashboard/permits/visa-renewal")) },
          { id: "act-post-vacancy",  title: "Post Job Vacancy",      icon: Briefcase,  keywords: ["job","vacancy","recruit"],       category: "Actions", action: () => router.push(l("/dashboard/recruitment/vacancies")) },
          { id: "act-gen-report",    title: "Generate Report",       icon: FileText,   keywords: ["export","report","generate"],    category: "Actions", action: () => router.push(l("/dashboard/reports")) },
          { id: "act-onboard",       title: "Start Onboarding",      icon: UserPlus,   keywords: ["onboard","new hire","wizard"],   category: "Actions", action: () => router.push(l("/dashboard/onboarding/wizard")) },
          { id: "act-upload-doc",    title: "Upload Document",       icon: FileText,   keywords: ["upload","document","file"],      category: "Actions", action: () => router.push(l("/dashboard/documents/repository")) },
        ],
      },
      {
        category: "AI",
        items: [
          { id: "ai-hub",          title: "AI Hub",                subtitle: "All AI modules",               icon: Sparkles,      keywords: ["ai","artificial intelligence"],  category: "AI", action: () => router.push(l("/dashboard/ai")) },
          { id: "ai-chat",         title: "AI Chat",               subtitle: "Conversational HR assistant",  icon: MessageSquare, keywords: ["chat","assistant"],              category: "AI", action: () => router.push(l("/dashboard/ai/chat")) },
          { id: "ai-orchestrator", title: "HR Orchestrator",       subtitle: "Multi-agent HR assistant",     icon: MessageSquare, keywords: ["orchestrator","multi-agent"],    category: "AI", action: () => router.push(l("/dashboard/ai/hr-orchestrator")) },
          { id: "ai-workflow",     title: "AI Workflow Builder",   subtitle: "Design autonomous workflows",  icon: Settings,      keywords: ["workflow","automation","build"], category: "AI", action: () => router.push(l("/dashboard/ai/workflow-builder")) },
          { id: "ai-compliance",   title: "Compliance Advisor",    subtitle: "Regulatory guidance",          icon: Shield,        keywords: ["compliance","regulatory"],       category: "AI", action: () => router.push(l("/dashboard/ai/compliance-advisor")) },
          { id: "ai-docs",         title: "Document Assistant",    subtitle: "AI document processing",       icon: FileText,      keywords: ["document","ocr","extract"],      category: "AI", action: () => router.push(l("/dashboard/ai/document-assistant")) },
          { id: "ai-analytics",    title: "AI Analytics",          subtitle: "Predictive analytics",         icon: BarChart3,     keywords: ["analytics","predict","ai"],      category: "AI", action: () => router.push(l("/dashboard/ai/analytics")) },
          { id: "ai-forecast",     title: "Workforce Forecasting", subtitle: "Headcount forecasting",        icon: BarChart3,     keywords: ["forecast","headcount","plan"],   category: "AI", action: () => router.push(l("/dashboard/ai/forecasting")) },
          { id: "ai-agents",       title: "AI Agents",             subtitle: "OpenClaw multi-agents",        icon: MessageSquare, keywords: ["agent","openclaw","robot"],      category: "AI", action: () => router.push(l("/dashboard/ai/agents")) },
        ],
      },
      {
        category: "Settings",
        items: [
          { id: "adm-users",        title: "User Management",    icon: Users,    keywords: ["user","accounts"],             category: "Settings", action: () => router.push(l("/dashboard/admin/users")) },
          { id: "adm-roles",        title: "Roles & Permissions",icon: Shield,   keywords: ["role","permission","rbac"],    category: "Settings", action: () => router.push(l("/dashboard/admin/roles")) },
          { id: "adm-audit",        title: "Audit Logs",         icon: FileText, keywords: ["audit","log","trail"],         category: "Settings", action: () => router.push(l("/dashboard/admin/audit-logs")) },
          { id: "adm-integrations", title: "API Integrations",   icon: Settings, keywords: ["api","integration","webhook"], category: "Settings", action: () => router.push(l("/dashboard/admin/api-integrations")) },
          { id: "adm-health",       title: "System Health",      icon: BarChart3,keywords: ["system","health","monitor"],   category: "Settings", action: () => router.push(l("/dashboard/admin/system-health")) },
          { id: "settings-general", title: "General Settings",   icon: Settings, keywords: ["preferences","configuration"], category: "Settings", action: () => router.push(l("/dashboard/settings")) },
          { id: "settings-profile", title: "Profile & Avatar",   icon: User,     keywords: ["profile","avatar"],            category: "Settings", action: () => router.push(l("/dashboard/settings/avatar")) },
          { id: "settings-sub",     title: "Subscription",       icon: CreditCard, keywords: ["plan","billing","pricing"], category: "Settings", action: () => router.push(l("/dashboard/settings/subscription")) },
          { id: "settings-help",    title: "Help & Support",     icon: HelpCircle, keywords: ["help","support","faq"],     category: "Settings", action: () => router.push(l("/dashboard/help")) },
        ],
      },
    ],
    [router, locale],
  );
}

// ─── Fuzzy Search ─────────────────────────────────────────────────────────────

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Direct substring match
  if (t.includes(q)) return true;

  // Fuzzy character matching
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) qi++;
  }
  return qi === q.length;
}

function scoreMatch(query: string, item: CommandItem): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const subtitle = item.subtitle?.toLowerCase() || "";
  const keywords = item.keywords?.map((k) => k.toLowerCase()) || [];

  // Exact match gets highest score
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;

  // Subtitle match
  if (subtitle.includes(q)) return 60;

  // Keyword match
  for (const kw of keywords) {
    if (kw.includes(q)) return 50;
    if (kw.startsWith(q[0])) return 30;
  }

  // Partial match
  if (title.includes(q)) return 40;

  // Fuzzy match
  if (fuzzyMatch(q, title)) return 20;

  return 0;
}

// ─── Command Palette ──────────────────────────────────────────────────────────

export function CommandPalette({
  extraGroups = [],
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  shortcutKey = "k",
  showRecent = true,
  className,
}: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? controlledOnOpenChange ?? (() => {})
    : setInternalOpen;

  // ── Keyboard shortcut ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === shortcutKey) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, shortcutKey, setOpen]);

  // Reset query on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ── Commands ──
  const pageGroups = usePageCommands();
  const registeredGroups = useRegisteredCommandGroups();
  const allGroups = useMemo(
    () => {
      const groups = [...pageGroups, ...extraGroups, ...registeredGroups];
      const seen = new Set<string>();
      return groups.map((group) => ({
        category: group.category,
        items: group.items.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        }),
      })).filter((group) => group.items.length > 0);
    },
    [pageGroups, extraGroups, registeredGroups]
  );

  // ── Filtered results ──
  const filteredGroups = useMemo(() => {
    if (!query) return allGroups;

    const results: CommandGroup[] = [];
    for (const group of allGroups) {
      const scored = group.items
        .map((item) => ({ item, score: scoreMatch(query, item) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

      if (scored.length > 0) {
        results.push({
          category: group.category,
          items: scored.map(({ item }) => item),
        });
      }
    }
    return results;
  }, [allGroups, query]);

  // ── Tracking recent items ──
  const trackAction = useCallback(
    (item: CommandItem) => {
      setRecentItems((prev) => {
        const next = [item.id, ...prev.filter((id) => id !== item.id)].slice(
          0,
          5
        );
        return next;
      });
      item.action();
      setOpen(false);
    },
    [setOpen]
  );

  // ── Recent items ──
  const recentCommands = useMemo(() => {
    if (!showRecent || query) return null;
    const allItems = allGroups.flatMap((g) => g.items);
    const recent = recentItems
      .map((id) => allItems.find((item) => item.id === id))
      .filter(Boolean) as CommandItem[];
    return recent.length > 0
      ? { category: "Recently Viewed" as CommandCategory, items: recent }
      : null;
  }, [allGroups, recentItems, query, showRecent]);

  // ── Theme toggle ──
  const themeItems: CommandGroup = {
    category: "Actions",
    items: [
      {
        id: "theme-light",
        title: "Switch to Light Theme",
        icon: Sun,
        keywords: ["light mode", "bright"],
        category: "Actions",
        action: () => setTheme("light"),
      },
      {
        id: "theme-dark",
        title: "Switch to Dark Theme",
        icon: Moon,
        keywords: ["dark mode", "night"],
        category: "Actions",
        action: () => setTheme("dark"),
      },
      {
        id: "theme-system",
        title: "Use System Theme",
        icon: Monitor,
        keywords: ["auto", "default"],
        category: "Actions",
        action: () => setTheme("system"),
      },
    ],
  };

  // ── Render ──
  const displayGroups = recentCommands
    ? [recentCommands, ...filteredGroups]
    : filteredGroups;

  const totalResults = displayGroups.reduce(
    (acc, g) => acc + g.items.length,
    0
  );

  const iconMap: Record<CommandCategory, typeof Clock> = {
    "Recently Viewed": Clock,
    Navigation: ArrowRight,
    Pages: FileText,
    Actions: Sparkles,
    AI: Sparkles,
    Settings: Settings,
    People: Users,
    Reports: FileText,
    Dashboards: LayoutDashboard,
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
      <Command
        className={cn("rounded-lg border shadow-md", className)}
        label="Command palette"
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 size-4 shrink-0 text-muted-foreground/60" />
          <CommandInput
            ref={inputRef}
            placeholder="Search pages, actions, settings, people..."
            value={query}
            onValueChange={setQuery}
            className="flex-1 border-0 bg-transparent p-0 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
          />
          {query && (
            <Badge
              variant="secondary"
              className="shrink-0 text-[10px] font-mono"
            >
              {totalResults} results
            </Badge>
          )}
        </div>

        <CommandList className="max-h-[400px]">
          {totalResults === 0 && query ? (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Search className="size-8 text-muted-foreground/30" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Try a different search term
                  </p>
                </div>
              </div>
            </CommandEmpty>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="p-1">
                {displayGroups.map((group, gi) => {
                  const Icon = iconMap[group.category] || FileText;
                  return (
                    <div key={group.category}>
                      <CommandGroup
                        heading={
                          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Icon className="size-3" />
                            {group.category}
                          </span>
                        }
                      >
                        {group.items.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={`${item.title} ${item.subtitle || ""} ${
                              item.keywords?.join(" ") || ""
                            }`}
                            onSelect={() => trackAction(item)}
                            className="flex items-center gap-3 rounded-md py-2.5"
                          >
                            {item.icon && (
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/50">
                                <item.icon className="size-3.5 text-muted-foreground" />
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {item.title}
                                </span>
                              </div>
                              {item.subtitle && (
                                <p className="text-xs text-muted-foreground/70 truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            {item.shortcut && (
                              <CommandShortcut className="text-[10px] font-mono">
                                {item.shortcut}
                              </CommandShortcut>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {gi < displayGroups.length - 1 && (
                        <CommandSeparator />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Footer hint */}
          <div className="border-t px-3 py-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded border bg-muted px-1 font-mono text-[9px] font-medium">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded border bg-muted px-1 font-mono text-[9px] font-medium">
                    ↵
                  </kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded border bg-muted px-1 font-mono text-[9px] font-medium">
                    esc
                  </kbd>
                  close
                </span>
              </div>
              <span className="flex items-center gap-1">
                <CommandIcon className="size-2.5" />
                <span>Cmd+K</span>
              </span>
            </div>
          </div>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

// ─── Hook: useCommandPalette ──────────────────────────────────────────────────

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);

  return { open, setOpen, toggle, openPalette, closePalette };
}
