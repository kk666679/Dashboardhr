"use client";

import { Conversation, Message, PromptInput, Sources } from "@/components/ai-elements";
import type { PromptInputMessage } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";
import type { FormEvent } from "react";

export function SOPAI() {
  const { messages, sendMessage, isThinking, sources } = useAI({
    endpoint: "/api/ai/sop",
  });

  const handleSubmit = (message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
    sendMessage(message.text);
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI SOP Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Generate SOP steps, suggest improvements, or answer SOP-related questions.
      </p>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      {sources && <Sources />}
      <PromptInput
        onSubmit={handleSubmit}
        placeholder="e.g., Generate SOP for employee onboarding"
      />
    </div>
  );
}
