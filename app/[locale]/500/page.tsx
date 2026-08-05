import type { Metadata } from "next";
import { ServerCrash } from "lucide-react";
import { StatusScreen } from "@/components/system/status-screen";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

export const metadata: Metadata = {
  title: "500 Server Error",
  description: "An unexpected server error occurred.",
};

export default function ServerErrorPage() {
  return (
    <StatusScreen
      code="500 - Server Error"
      title="Internal server error"
      description="Our servers encountered an unexpected condition. The team has been notified. Please try again in a few moments."
      icon={<ServerCrash className="h-6 w-6" aria-hidden="true" />}
      actions={[
        { label: "Go home", href: ROUTE.system.home },
        { label: "Open dashboard", href: ROUTE.dashboard.root, variant: "outline" },
      ]}
    />
  );
}
