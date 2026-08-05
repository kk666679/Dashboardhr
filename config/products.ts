import {
  LayoutDashboard,
  Wallet,
  Workflow,
  Sparkles,
  Building,
  Users,
  User,
  Briefcase,
  Cloud,
  type LucideIcon,
} from "lucide-react";

export interface Product {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "HR administration, analytics, and workforce management",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgGradient: "from-blue-500/20 to-blue-600/10",
  },
  {
    id: "accounting",
    title: "Accounting",
    description: "Invoices, payroll, tax calculator, government submissions",
    href: "/accounting",
    icon: Wallet,
    color: "text-emerald-600",
    bgGradient: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    id: "automation",
    title: "Automation",
    description: "Workflow engine, QMS, SOPs, flow designer, templates",
    href: "/automation",
    icon: Workflow,
    color: "text-purple-600",
    bgGradient: "from-purple-500/20 to-purple-600/10",
  },
  {
    id: "ai",
    title: "AI",
    description: "Chat hub, knowledge base, semantic search, HR orchestrator",
    href: "/ai",
    icon: Sparkles,
    color: "text-amber-600",
    bgGradient: "from-amber-500/20 to-amber-600/10",
  },
  {
    id: "capex",
    title: "CAPEX",
    description: "Assets, projects, budget, ROI analysis, ISO compliance",
    href: "/capex",
    icon: Building,
    color: "text-rose-600",
    bgGradient: "from-rose-500/20 to-rose-600/10",
  },
  {
    id: "employees",
    title: "Employees",
    description: "Employee management, onboarding, foreign workers, expats",
    href: "/employees",
    icon: Users,
    color: "text-cyan-600",
    bgGradient: "from-cyan-500/20 to-cyan-600/10",
  },
  {
    id: "ess",
    title: "ESS",
    description: "Employee self-service — payslips, leave, claims, training",
    href: "/ess",
    icon: User,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500/20 to-indigo-600/10",
  },
  {
    id: "mss",
    title: "MSS",
    description: "Manager self-service — team, approvals, attendance, performance",
    href: "/mss",
    icon: Briefcase,
    color: "text-orange-600",
    bgGradient: "from-orange-500/20 to-orange-600/10",
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Government API integrations and third-party connectors",
    href: "/integrations",
    icon: Cloud,
    color: "text-sky-600",
    bgGradient: "from-sky-500/20 to-sky-600/10",
  },
];

export const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
) as Record<string, Product>;

export function getProductById(id: string): Product | undefined {
  return PRODUCT_MAP[id];
}

/** Products that were previously Dashboard submodules but are now independent */
export const DETACHED_FROM_DASHBOARD = [
  "accounting",
  "automation",
  "ai",
  "capex",
  "employees",
  "ess",
  "mss",
  "integrations",
] as const;

