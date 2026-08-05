"use client";

import { Conversation, Message, PromptInput } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function EquityAI() {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/equity",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
      <h3 className="text-lg font-semibold">AI Equity Assistant</h3>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg: AIChatMessage, index: number) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput
        onSubmit={(msg) => sendMessage(msg.text)}
        placeholder="Project vesting for equity grants..."
      />
    </div>
  );
}
