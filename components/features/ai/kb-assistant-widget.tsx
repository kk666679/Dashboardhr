"use client";

import { KbAssistantChat } from "@/components/features/ai/kb-assistant-chat";

export type KbChatRole = "user" | "assistant";

export interface KbChatMessage {
  id: string;
  role: KbChatRole;
  content: string;
  sources?: { source: string; score: number }[];
}

export interface KbAssistantWidgetProps {
  /**
   * "floating" renders a toggle button (embedded/widget UIs).
   * "alwaysOpen" renders the panel immediately (KB page route).
   */
  variant: "floating" | "alwaysOpen";
}

export function KbAssistantWidget({ variant }: KbAssistantWidgetProps) {
  return <KbAssistantChat variant={variant} />;
}
