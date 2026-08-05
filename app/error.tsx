"use client";

import { useEffect } from "react";
import { ServerCrash } from "lucide-react";
import { StatusScreen } from "@/components/system/status-screen";
import { ROUTE } from "@/components/dashboard-sidebar/route-mapping";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[v0] Route error boundary caught:", error);
  }, [error]);

  return (
    <StatusScreen
      code="500 - Server Error"
      title="Something went wrong"
      description="An unexpected error occurred while processing your request. You can try again, and if the problem persists, contact support."
      icon={<ServerCrash className="h-6 w-6" aria-hidden="true" />}
      actions={[
        { label: "Try again", onClick: () => reset() },
        { label: "Go home", href: ROUTE.system.home, variant: "outline" },
      ]}
    />
  );
}
