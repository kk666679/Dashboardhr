// Dashboard sidebar barrel export
export { AppSidebar } from "./app-sidebar";
export { Header } from "./header";
export { Navbar } from "./navbar";
export { SidebarFooter } from "./sidebar-footer";
export { KbChat } from "./kb-chat";
export { SubscriptionPlans } from "./subscription-plans";

// Route mapping (typed constants)
export { ROUTE } from "./route-mapping";
export type { DashboardRoot, EssRoot, MssRoot } from "./route-mapping";

// Legacy sidebar-data – keep re-export for any consumers that still reference it
export { sidebarItems } from "./sidebar-data";
export type { SidebarItem } from "./sidebar-data";