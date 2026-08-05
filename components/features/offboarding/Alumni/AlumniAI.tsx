"use client";

import { Conversation, Message, PromptInput, PromptInputTextarea } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";

export function AlumniAI({ alumniId }: { alumniId: string }) {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/alumni",
    context: { alumniId },
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">Alumni Engagement Assistant</h3>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message role="assistant" content="Thinking..." isLoading />}
      </Conversation>
      <PromptInput onSubmit={(msg) => sendMessage(msg.text)}>
        <PromptInputTextarea placeholder="Suggest engagement ideas..." />
      </PromptInput>
    </div>
  );
}

