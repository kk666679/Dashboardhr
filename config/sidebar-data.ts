/**
 * Canonical sidebar data for the unified app shell.
 *
 * Routes are authored in `config/navigation.ts`; this module is the stable
 * platform-facing entry point so feature code no longer imports legacy
 * dashboard-sidebar data or route mappings directly.
 */
export { getNavForProduct as getSidebarData } from "./navigation";
export type { NavItem as SidebarItem, NavSection as SidebarSection } from "./navigation";
