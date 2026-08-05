"use client";

import type { UIMessage } from "ai";
import {
  Bot,
  ShieldCheck,
  DollarSign,
  Users,
  FileText,
  GraduationCap,
} from "lucide-react";

export type AgentUiRole = "compliance" | "payroll" | "recruitment" | "employee" | "expat";

function extractText(message: UIMessage): string {
  const parts = message.parts as Array<{ type: string; text?: string }> | undefined;
  if (!Array.isArray(parts)) return "...";

  return (
    parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .filter(Boolean)
      .join("") || "..."
  );
}

function AgentIcon({ agent }: { agent: AgentUiRole }) {
  switch (agent) {
    case "compliance":
      return <ShieldCheck className="w-4 h-4 mt-1 text-red-600" />;
    case "payroll":
      return <DollarSign className="w-4 h-4 mt-1 text-green-600" />;
    case "recruitment":
      return <Users className="w-4 h-4 mt-1 text-blue-600" />;
    case "employee":
      return <GraduationCap className="w-4 h-4 mt-1 text-purple-600" />;
    case "expat":
      return <FileText className="w-4 h-4 mt-1 text-orange-600" />;
    default:
      return <Bot className="w-4 h-4 mt-1" />;
  }
}

export function AiMessageRow({
  message,
  agent,
}: {
  message: UIMessage;
  agent: AgentUiRole;
}) {
  const textContent = extractText(message);

  return (
    <>
      {message.role === "user" ? (
        <Bot className="w-4 h-4 mt-1" />
      ) : (
        <AgentIcon agent={agent} />
      )}

      <div className="flex-1">
        <p className="text-sm font-medium mb-1">
          {message.role === "user"
            ? "You"
            : `${agent[0].toUpperCase()}${agent.slice(1)} AI`}
        </p>
        <p className="text-sm">{textContent}</p>
      </div>
    </>
  );
}

