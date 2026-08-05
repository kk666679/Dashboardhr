import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { StatusScreen } from "@/components/system/status-screen";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

export const metadata: Metadata = {
  title: "403 Forbidden",
  description: "You do not have permission to access this resource.",
};

export default function ForbiddenPage() {
  return (
    <StatusScreen
      code="403 - Forbidden"
      title="Access denied"
      description="You do not have permission to access this resource. If you believe this is a mistake, contact your administrator to review your role permissions."
      icon={<ShieldAlert className="h-6 w-6" aria-hidden="true" />}
      actions={[
        { label: "Back to dashboard", href: ROUTE.dashboard.root },
        { label: "Sign in as another user", href: ROUTE.system.login, variant: "outline" },
      ]}
    />
  );
}
