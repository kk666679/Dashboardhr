/**
 * ESS (Employee Self-Service) Portal Layout
 *
 * Minimal navigation shell with PWA support.
 * Full feature parity between web and mobile.
 */

import type { Metadata, Viewport } from "next";
import { EssLayoutClient } from "@/components/features/ess/EssLayoutClient";

export const metadata: Metadata = {
  title: "My HR — Employee Self-Service",
  description: "Employee self-service portal",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "My HR" },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function EssLayout({ children }: { children: React.ReactNode }) {
  return <EssLayoutClient>{children}</EssLayoutClient>;
}
