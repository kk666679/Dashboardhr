import { Conversation, Message, PromptInput, Sources } from "@/components/ai-elements";
import type { PromptInputMessage } from "@/components/ai-elements";
import { useAI } from "@/hooks/useAI";
import type { FormEvent } from "react";

export function CompanyAI() {
  const { messages, sendMessage, isThinking, sources } = useAI({
    endpoint: "/api/ai/company",
  });

  const handleSubmit = (message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
    sendMessage(message.text);
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Company Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get help with company setup, compliance, or organizational structure.
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
        placeholder="e.g., What documents are needed for company registration?"
      />
    </div>
  );
}
