"use client";

import { Conversation, Message, PromptInput, PromptInputTextarea } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

export function BenchAI() {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/bench",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Bench Analyst</h3>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput
        onSubmit={async (message) => { await sendMessage(message.text); }}
      >
        <PromptInputTextarea placeholder="Analyse bench strength metrics..." />
      </PromptInput>
    </div>
  );
}

