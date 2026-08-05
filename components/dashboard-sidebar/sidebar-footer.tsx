"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Settings, HelpCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getLocaleFromPath, setLocaleInPath } from "@/lib/locale-utils";

export function SidebarFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2"
        onClick={() => router.push(setLocaleInPath("/dashboard/settings", getLocaleFromPath(pathname)))}
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2"
        onClick={() => router.push(setLocaleInPath("/dashboard/help", getLocaleFromPath(pathname)))}
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={signOut}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
