"use client";

import { Conversation, Message, PromptInput } from "@/components/ai-elements";
import { InputGroupTextarea, InputGroupButton } from "@/components/ui/input-group";
import { CornerDownLeftIcon } from "lucide-react";
import { useAI } from "@/hooks/useAI";

export function ZakatAI() {
  const { messages, sendMessage, isThinking } = useAI({
    endpoint: "/api/ai/zakat",
  });

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <h3 className="text-lg font-semibold">AI Zakat Assistant</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get help with zakat calculations, eligibility, or distribution advice.
      </p>
      <Conversation className="max-h-60 overflow-y-auto my-3">
        {messages.map((msg, i) => (
          <Message key={i} from={msg.role} content={msg.content} />
        ))}
        {isThinking && <Message from="assistant" content="Thinking…" />}
      </Conversation>
      <PromptInput onSubmit={(message) => sendMessage(message.text)}>
        <InputGroupTextarea
          placeholder="e.g., Calculate zakat for RM 60,000 income"
          name="message"
          className="field-sizing-content max-h-48 min-h-16"
        />
        <InputGroupButton type="submit" variant="default" size="icon-sm">
          <CornerDownLeftIcon className="size-4" />
        </InputGroupButton>
      </PromptInput>
    </div>
  );
}