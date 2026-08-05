"use client";

import { Conversation, Message, PromptInput, PromptInputTextarea, Tool } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

interface ClearanceAIProps {
  instanceId: string;
}

export function ClearanceAI({ instanceId }: ClearanceAIProps) {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/clearance",
    context: { instanceId },
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Clearance Assistant</h3>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput onSubmit={(msg) => sendMessage(msg.text)}>
        <PromptInputTextarea placeholder="Ask about clearance status..." />
      </PromptInput>
    </div>
  );
}

