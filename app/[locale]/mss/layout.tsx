import type { Metadata } from "next";
import { MssLayoutClient } from "@/components/features/mss/MssLayoutClient";

export const metadata: Metadata = {
  title: "Manager Self-Service",
  description: "Team management, approvals, and analytics",
};

export default function MssLayout({ children }: { children: React.ReactNode }) {
  return <MssLayoutClient>{children}</MssLayoutClient>;
}