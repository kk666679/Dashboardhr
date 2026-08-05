"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plane, Home, Globe, Send } from "lucide-react";
import { useExpatriates } from "@/hooks/useExpatriates";

import { useToast } from "@/hooks/use-toast";
import { Agent, AgentHeader } from "@/components/ai-elements/agent";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Reasoning } from "@/components/ai-elements/reasoning";
import { AiMessageRow } from "./ai-message-renderer";

export function AIExpatAgent() {
  const [inputText, setInputText] = useState("");
  const expatAgent = useExpatriates();
  const { messages, sendMessage, isLoading: statusLoading } = expatAgent;

  const { toast } = useToast();

  const isLoading = statusLoading;

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    await sendMessage(text);
    toast({
      title: "Sent to Expat Agent",
      description: "Processing expatriate requirements...",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const handleVisaChecklist = () => {
    expatAgent.visaChecklist('Bangladeshi');
  };


  return (
    <Agent className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
      <AgentHeader name="Expat Agent" model="Immigration & Relocation">
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
          Visas • Permits • Relocation
        </Badge>
      </AgentHeader>

      <div className="p-4 space-y-4">
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-900 font-medium mb-1">Live:</p>
          <p className="text-xs text-orange-800">Expiring: {expatAgent.expatriates?.length || 0}</p>
        </div>


        <Conversation className="h-80 border rounded-lg bg-white">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Ready for Expat Support"
                description="Handle visa applications, work permits, relocation assistance, and immigration compliance"
                icon={<Globe className="h-8 w-8 text-orange-600" />}
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-100"
                    onClick={() =>
                      handlePromptSelect("Apply for employment pass (EP)")
                    }
                  >
                    Employment Pass
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Arrange expatriate relocation package",
                      )
                    }
                  >
                    Relocation Support
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-100"
                    onClick={() =>
                      handlePromptSelect("Check visa extension requirements")
                    }
                  >
                    Visa Extension
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Prepare immigration compliance checklist",
                      )
                    }
                  >
                    Immigration Compliance
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-yellow-100" onClick={handleVisaChecklist}>
                    Visa Checklist (Hook)
                  </Badge>
                </div>

              </ConversationEmptyState>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent className="flex items-start gap-2">
                  <AiMessageRow message={message} agent="expat" />
                </MessageContent>
              </Message>
            ))}

            {isLoading && (
              <Reasoning>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="w-4 h-4 animate-pulse" />
                  Processing expatriate requirements...
                </div>
              </Reasoning>
            )}
          </ConversationContent>
        </Conversation>

        <div className="flex gap-2 pt-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Visa application? Relocation help? Permit renewal?..."
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-1 border-orange-200 focus:border-orange-400"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Agent>
  );
}
