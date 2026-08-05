import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { StatusScreen } from "@/components/system/status-screen";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

export const metadata: Metadata = {
  title: "Scheduled Maintenance",
  description: "The platform is temporarily unavailable for scheduled maintenance.",
};

export default function MaintenancePage() {
  return (
    <StatusScreen
      code="Scheduled Maintenance"
      title="We'll be back shortly"
      description="AiFWMS is undergoing scheduled maintenance to improve your experience. Service will resume automatically once the work is complete."
      icon={<Wrench className="h-6 w-6" aria-hidden="true" />}
      actions={[{ label: "Retry", href: ROUTE.system.home }]}
    />
  );
}
