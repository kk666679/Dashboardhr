"use client";

import { Conversation, Message, PromptInput, PromptInputTextarea } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

export function SettlementAI({ terminationId }: { terminationId: string }) {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/settlement",
    context: { terminationId },
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">Settlement Assistant</h3>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput
        onSubmit={async (message) => { await sendMessage(message.text); }}
      >
        <PromptInputTextarea placeholder="Generate settlement draft..." />
      </PromptInput>
    </div>
  );
}

