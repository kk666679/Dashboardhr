import { FileQuestion } from "lucide-react";
import { StatusScreen } from "@/components/system/status-screen";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

export default function NotFound() {
  return (
    <StatusScreen
      code="404 - Not Found"
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved. Check the URL or return to a known location."
      icon={<FileQuestion className="h-6 w-6" aria-hidden="true" />}
      actions={[
        { label: "Go home", href: ROUTE.system.home },
        { label: "Open dashboard", href: ROUTE.dashboard.root, variant: "outline" },
      ]}
    />
  );
}
