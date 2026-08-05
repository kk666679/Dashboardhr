import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserPlus,
  Truck,
  UserMinus,
  Award,
  FileText,
  Shield,
  Database,
  CreditCard,
  HeartPulse,
  Home,
  Calendar,
  UserCog,
  Zap,
  GitBranch,
  FolderTree,
  Bot,
  Cloud,
  CalendarDays,
  LogOut,
  Bell,
  Settings,
  Building,
  MapPin,
  GraduationCap,
  Briefcase,
  Handshake,
  History,
  ShieldCheck,
  Heart,
  Target,
  Plane,
  Clock,
  TrendingUp,
  Layers,
  Receipt,
  Calculator,
  Globe,
  Workflow,
  Play,
  BarChart3 as BarChart3Icon,
  FileText as FileTextIcon,
  Shield as ShieldIcon,
  GitBranch as GitBranchIcon,
  MessageSquare,
  BookOpen,
  Search,
  Network,
  UserPlus as UserPlusIcon,
  Sparkles,
  Wallet,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
} from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavItem[];
  badge?: string;
  hidden?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// ─── Product Navigations ─────────────────────────────────────────────────────

export const DASHBOARD_NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Workforce",
    items: [
      { title: "Workers", href: "/dashboard/workers", icon: Users,
        children: [
          { title: "All Workers", href: "/dashboard/workers" },
          { title: "Add Worker", href: "/dashboard/workers/add" },
          { title: "Attendance Alert", href: "/dashboard/workers/attendance-alert" },
          { title: "Leave Request", href: "/dashboard/workers/leave-request" },
          { title: "Payroll Adjustment", href: "/dashboard/workers/payroll-adjustment" },
        ],
      },
      { title: "Onboarding", href: "/dashboard/onboarding", icon: UserPlus },
      { title: "Offboarding", href: "/dashboard/offboarding", icon: LogOut },
      { title: "Termination", href: "/dashboard/termination", icon: UserMinus },
      { title: "Leave Management", href: "/dashboard/leave", icon: Calendar },
    ],
  },
  {
    label: "Payroll & Finance",
    items: [
      { title: "Payroll", href: "/dashboard/payroll", icon: CreditCard,
        children: [
          { title: "Payroll Dashboard", href: "/dashboard/payroll" },
          { title: "Statutory", href: "/dashboard/payroll/statutory" },
        ],
      },
      { title: "Compensation & Benefits", href: "/dashboard/compensation-benefits", icon: Award },
      { title: "Benefits", href: "/dashboard/benefits", icon: Heart },
    ],
  },
  {
    label: "Compliance & Permits",
    items: [
      { title: "Compliance", href: "/dashboard/compliance", icon: Shield,
        children: [
          { title: "Dashboard", href: "/dashboard/compliance" },
          { title: "New Audit", href: "/dashboard/compliance/audit/new" },
          { title: "Zakat", href: "/dashboard/compliance/zakat" },
        ],
      },
      { title: "Permits & Visas", href: "/dashboard/permits", icon: Truck,
        children: [
          { title: "Permit Overview", href: "/dashboard/permits" },
          { title: "Apply Permit", href: "/dashboard/permits/apply" },
          { title: "Bulk Renewal", href: "/dashboard/permits/bulk-renewal" },
          { title: "Levy Calculator", href: "/dashboard/permits/levy-calculator" },
          { title: "Visa Renewal", href: "/dashboard/permits/visa-renewal" },
        ],
      },
      { title: "Medical / FOMEMA", href: "/dashboard/medical", icon: HeartPulse,
        children: [
          { title: "Medical Dashboard", href: "/dashboard/medical" },
          { title: "FOMEMA", href: "/dashboard/medical/fomema" },
          { title: "Schedule Exam", href: "/dashboard/medical/fomema/schedule" },
        ],
      },
      { title: "Accommodation", href: "/dashboard/accommodation", icon: Home,
        children: [
          { title: "Accommodation List", href: "/dashboard/accommodation" },
          { title: "Inspection", href: "/dashboard/accommodation/inspection" },
        ],
      },
      { title: "Geolocation", href: "/dashboard/geolocation", icon: MapPin,
        children: [
          { title: "Dashboard", href: "/dashboard/geolocation" },
          { title: "Live Tracking", href: "/dashboard/geolocation/live-tracking" },
          { title: "Geofences", href: "/dashboard/geolocation/geofences" },
          { title: "Alerts", href: "/dashboard/geolocation/alerts" },
          { title: "History", href: "/dashboard/geolocation/history" },
          { title: "Analytics", href: "/dashboard/geolocation/analytics" },
          { title: "Settings", href: "/dashboard/geolocation/settings" },
        ],
      },
      { title: "Health & Safety", href: "/dashboard/health-safety", icon: ShieldCheck },
    ],
  },
  {
    label: "Talent",
    items: [
      { title: "Recruitment", href: "/dashboard/recruitment", icon: Briefcase },
      { title: "Talent Acquisition", href: "/dashboard/talent-acquisition", icon: Briefcase },
      { title: "Performance", href: "/dashboard/performance", icon: Award,
        children: [
          { title: "Performance Reviews", href: "/dashboard/performance" },
          { title: "New Review", href: "/dashboard/performance/new" },
        ],
      },
      { title: "Learning & Development", href: "/dashboard/learning-development", icon: GraduationCap },
      { title: "Succession Planning", href: "/dashboard/succession", icon: Target },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "SOPs", href: "/dashboard/sops", icon: FileText,
        children: [
          { title: "SOP List", href: "/dashboard/sops" },
          { title: "Create SOP", href: "/dashboard/sops/new" },
        ],
      },
      { title: "Organisation", href: "/dashboard/organisation", icon: Building },
      { title: "Workforce Planning", href: "/dashboard/workforce-planning", icon: Layers },
      { title: "Scheduling", href: "/dashboard/scheduling", icon: CalendarDays },
      { title: "Employee Relations", href: "/dashboard/employee-relations", icon: Handshake },
      { title: "Industrial Relations", href: "/dashboard/industrial-relations", icon: Users },
      { title: "Documents", href: "/dashboard/documents", icon: FileText },
      { title: "Travel", href: "/dashboard/travel", icon: Plane },
      { title: "Lifecycle Events", href: "/dashboard/lifecycle", icon: Clock },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "3" },
      { title: "Settings", href: "/dashboard/settings", icon: Settings,
        children: [
          { title: "General", href: "/dashboard/settings" },
          { title: "Avatar", href: "/dashboard/settings/avatar" },
          { title: "Pricing", href: "/dashboard/settings/pricing" },
          { title: "Subscription", href: "/dashboard/settings/subscription" },
        ],
      },
      { title: "Subscription", href: "/dashboard/subscription", icon: TrendingUp },
      { title: "Audit Trail", href: "/dashboard/audit-trail", icon: History },
      { title: "Security", href: "/dashboard/security", icon: ShieldCheck },
      { title: "Data Governance", href: "/dashboard/data-governance", icon: Database },
      { title: "Admin", href: "/dashboard/admin", icon: Settings },
      { title: "PDF Generator", href: "/dashboard/pdf-generator", icon: FileText },
    ],
  },
];

export const ACCOUNTING_NAV: NavSection[] = [
  {
    label: "Accounting",
    items: [
      { title: "Overview", href: "/accounting", icon: Wallet },
      { title: "Invoices", href: "/accounting/invoices", icon: FileText,
        children: [
          { title: "All Invoices", href: "/accounting/invoices" },
          { title: "Create Invoice", href: "/accounting/invoices/create" },
        ],
      },
      { title: "Delivery Orders", href: "/accounting/delivery-orders", icon: Truck,
        children: [
          { title: "All D.O.", href: "/accounting/delivery-orders" },
          { title: "Create D.O.", href: "/accounting/delivery-orders/create" },
        ],
      },
      { title: "Credit Notes", href: "/accounting/credit-notes", icon: Receipt },
      { title: "Debit Notes", href: "/accounting/debit-notes", icon: Receipt },
      { title: "Payroll", href: "/accounting/payroll", icon: CreditCard },
      { title: "Payroll Calculator", href: "/accounting/payroll-calculator", icon: Calculator },
      { title: "E-Invoice", href: "/accounting/e-invoice", icon: FileText },
      { title: "Financial Reports", href: "/accounting/reports", icon: BarChart3Icon },
      { title: "Tax Calculator", href: "/accounting/tax-calculator", icon: Calculator },
      { title: "Government Submissions", href: "/accounting/government-submissions", icon: Globe },
      { title: "Enhanced Dashboard", href: "/accounting/enhanced", icon: TrendingUp },
    ],
  },
];

export const AUTOMATION_NAV: NavSection[] = [
  {
    label: "Automation",
    items: [
      { title: "Overview", href: "/automation", icon: Workflow },
      { title: "Flow Designer", href: "/automation/designer", icon: GitBranchIcon },
      { title: "Flow Process", href: "/automation/flow-process", icon: FolderTree,
        children: [
          { title: "Flow Designer", href: "/automation/flow-process" },
          { title: "Enhanced Flow", href: "/automation/flow-process/enhanced" },
        ],
      },
      { title: "Workflow Engine", href: "/automation/workflow-engine", icon: Play,
        children: [
          { title: "Engine Dashboard", href: "/automation/workflow-engine" },
          { title: "Monitor", href: "/automation/workflow-engine/monitor" },
        ],
      },
      { title: "Execution Monitor", href: "/automation/monitor", icon: Activity },
      { title: "QMS / Quality", href: "/automation/qms", icon: ShieldIcon },
      { title: "SOP Workflows", href: "/automation/sops", icon: FileTextIcon },
      { title: "Analytics", href: "/automation/analytics", icon: BarChart3Icon },
      { title: "Templates", href: "/automation/templates", icon: GitBranch },
    ],
  },
];

export const AI_NAV: NavSection[] = [
  {
    label: "AI Tools",
    items: [
      { title: "AI Hub", href: "/ai", icon: Sparkles },
      { title: "Chat Hub", href: "/ai/chat-hub", icon: MessageSquare },
      { title: "Knowledge Base Chat", href: "/ai/kb-chat", icon: BookOpen },
      { title: "Semantic Search", href: "/ai/semantic-search", icon: Search },
      { title: "HR Orchestrator", href: "/ai/hr-orchestrator", icon: Network },
      { title: "Document Generator", href: "/ai/doc-generator", icon: FileText },
      { title: "Compliance AI", href: "/ai/compliance", icon: Shield },
      { title: "Payroll AI", href: "/ai/payroll", icon: CreditCard },
      { title: "Recruitment AI", href: "/ai/recruitment", icon: UserPlusIcon },
      { title: "Employee AI", href: "/ai/employee", icon: Users },
      { title: "Expat AI", href: "/ai/expat", icon: Globe },
    ],
  },
];

export const CAPEX_NAV: NavSection[] = [
  {
    label: "CAPEX",
    items: [
      { title: "Overview", href: "/capex", icon: TrendingUp },
      { title: "Assets", href: "/capex/assets", icon: Building },
      { title: "Projects", href: "/capex/projects", icon: Briefcase },
      { title: "Budget", href: "/capex/budget", icon: Wallet },
      { title: "ROI Analysis", href: "/capex/roi", icon: Target },
      { title: "ISO Management", href: "/capex/iso", icon: ShieldCheck,
        children: [
          { title: "ISO Dashboard", href: "/capex/iso" },
          { title: "Audit Checklist", href: "/capex/iso/audit-checklist" },
          { title: "Create Audit Plan", href: "/capex/iso/audit-create-plan" },
          { title: "Generate Audit", href: "/capex/iso/audit-generate" },
          { title: "CAPA", href: "/capex/iso/capa-create" },
          { title: "Compliance Check", href: "/capex/iso/compliance-check" },
          { title: "Compliance Dashboard", href: "/capex/iso/compliance-dashboard" },
          { title: "Compliance Score", href: "/capex/iso/compliance-score" },
          { title: "Fishbone", href: "/capex/iso/fishbone" },
          { title: "5 Whys", href: "/capex/iso/five-whys" },
          { title: "Gap Analysis", href: "/capex/iso/gap-analysis" },
        ],
      },
      { title: "OPEX", href: "/capex/opex", icon: TrendingUp,
        children: [
          { title: "Overview", href: "/capex/opex" },
          { title: "Lean", href: "/capex/opex/lean" },
          { title: "Six Sigma", href: "/capex/opex/six-sigma" },
          { title: "Kaizen", href: "/capex/opex/kaizen" },
          { title: "Kanban", href: "/capex/opex/kanban" },
          { title: "Analytics", href: "/capex/opex/analytics" },
        ],
      },
    ],
  },
];

export const EMPLOYEES_NAV: NavSection[] = [
  {
    label: "Employees",
    items: [
      { title: "All Employees", href: "/employees", icon: Users },
      { title: "New Employee", href: "/employees/new", icon: UserPlus },
      { title: "Onboarding", href: "/employees/onboarding", icon: UserPlusIcon },
      { title: "Offboarding", href: "/employees/offboarding", icon: LogOut },
      { title: "Medical", href: "/employees/medical", icon: HeartPulse },
      { title: "Permits", href: "/employees/permits", icon: Truck },
      { title: "Foreign Workers", href: "/employees/foreign-workers", icon: Globe },
      { title: "Expatriates", href: "/employees/expatriates", icon: Plane },
    ],
  },
];

export const ESS_NAV: NavSection[] = [
  {
    label: "ESS",
    items: [
      { title: "Dashboard", href: "/ess", icon: Home },
      { title: "Profile", href: "/ess/profile", icon: User },
      { title: "Payslips", href: "/ess/payslips", icon: CreditCard },
      { title: "Leave", href: "/ess/leave", icon: Calendar },
      { title: "Claims", href: "/ess/claims", icon: FileText },
      { title: "Assets", href: "/ess/assets", icon: Briefcase },
      { title: "Training", href: "/ess/training", icon: GraduationCap },
      { title: "Workers", href: "/ess/workers", icon: Users },
    ],
  },
];

export const MSS_NAV: NavSection[] = [
  {
    label: "MSS",
    items: [
      { title: "Dashboard", href: "/mss", icon: Home },
      { title: "Team", href: "/mss/team", icon: Users },
      { title: "Approvals", href: "/mss/approvals", icon: CheckCircle2 },
      { title: "Attendance", href: "/mss/attendance", icon: Calendar },
      { title: "Performance", href: "/mss/performance", icon: TrendingUp },
    ],
  },
];

export const INTEGRATIONS_NAV: NavSection[] = [
  {
    label: "Integrations",
    items: [
      { title: "Overview", href: "/integrations", icon: Cloud },
      { title: "Government APIs", href: "/integrations/government", icon: Shield },
      { title: "Agencies Integration", href: "/integrations/government/agencies-integration", icon: Globe },
    ],
  },
];

/** Map product id to its navigation sections */
export const PRODUCT_NAV_MAP: Record<string, NavSection[]> = {
  dashboard: DASHBOARD_NAV,
  accounting: ACCOUNTING_NAV,
  automation: AUTOMATION_NAV,
  ai: AI_NAV,
  capex: CAPEX_NAV,
  employees: EMPLOYEES_NAV,
  ess: ESS_NAV,
  mss: MSS_NAV,
  integrations: INTEGRATIONS_NAV,
};

export function getNavForProduct(productId: string): NavSection[] {
  return PRODUCT_NAV_MAP[productId] ?? [];
}

