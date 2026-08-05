"use client";

import { Conversation, Message, PromptInput, PromptInputTextarea } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

export function TabungHajiAI() {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/tabung-haji",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">Tabung Haji Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Ask about contribution trends, advice on savings, or eligibility.
      </p>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput
        onSubmit={async (message) => { await sendMessage(message.text); }}
      >
        <PromptInputTextarea placeholder="e.g., What's the optimal monthly deduction?" />
      </PromptInput>
    </div>
  );
}

