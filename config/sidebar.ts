import { getSidebarData } from "./sidebar-data";
import type { SidebarSection as NavSection } from "./sidebar-data";

export interface SidebarConfig {
  productId: string;
  title: string;
  sections: NavSection[];
  /** Whether to show the product switcher in the sidebar header */
  showProductSwitcher?: boolean;
  /** Whether to show the collapse toggle */
  collapsible?: boolean;
}

const SIDEBAR_CONFIGS: Record<string, SidebarConfig> = {
  dashboard: {
    productId: "dashboard",
    title: "HR Administration",
    sections: getSidebarData("dashboard"),
    showProductSwitcher: true,
    collapsible: true,
  },
  accounting: {
    productId: "accounting",
    title: "Accounting",
    sections: getSidebarData("accounting"),
    showProductSwitcher: true,
    collapsible: true,
  },
  automation: {
    productId: "automation",
    title: "Automation",
    sections: getSidebarData("automation"),
    showProductSwitcher: true,
    collapsible: true,
  },
  ai: {
    productId: "ai",
    title: "AI",
    sections: getSidebarData("ai"),
    showProductSwitcher: true,
    collapsible: true,
  },
  capex: {
    productId: "capex",
    title: "CAPEX",
    sections: getSidebarData("capex"),
    showProductSwitcher: true,
    collapsible: true,
  },
  employees: {
    productId: "employees",
    title: "Employees",
    sections: getSidebarData("employees"),
    showProductSwitcher: true,
    collapsible: true,
  },
  ess: {
    productId: "ess",
    title: "Employee Portal",
    sections: getSidebarData("ess"),
    showProductSwitcher: false,
    collapsible: false,
  },
  mss: {
    productId: "mss",
    title: "Manager Portal",
    sections: getSidebarData("mss"),
    showProductSwitcher: false,
    collapsible: false,
  },
  integrations: {
    productId: "integrations",
    title: "Integrations",
    sections: getSidebarData("integrations"),
    showProductSwitcher: true,
    collapsible: true,
  },
};

export function getSidebarConfig(productId: string): SidebarConfig | undefined {
  return SIDEBAR_CONFIGS[productId];
}
