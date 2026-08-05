"use client";

import { Conversation, Message, PromptInput } from "@/components/ai-elements";
import type { PromptInputMessage } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";
import type { FormEvent } from "react";

interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function IncentiveAI() {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/incentive",
  });

  const handleSubmit = (message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
    sendMessage(message.text);
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
      <h3 className="text-lg font-semibold">AI Incentive Assistant</h3>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg: AIChatMessage, index: number) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput
        onSubmit={handleSubmit}
        placeholder="Suggest metric weights for incentives..."
      />
    </div>
  );
}
