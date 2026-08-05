"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShieldCheck, Send, Bot } from "lucide-react";
import { useComplianceAgent } from "@/hooks/useCompliance";
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

export function AIComplianceAgent() {
  const [inputText, setInputText] = useState("");
  const complianceAgent = useComplianceAgent();
  const { toast } = useToast();

  const { messages, sendMessage, status } = complianceAgent;


  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    await sendMessage(text);
    toast({
      title: "Sent to Compliance Agent",
      description: "Checking Malaysian labor laws...",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const handleChecklist = () => {
    complianceAgent.generateChecklist('construction');
  };


  return (
    <Agent className="border-red-200 bg-gradient-to-br from-red-50/50 to-amber-50/50">
      <AgentHeader name="Compliance Agent" model="Malaysian Labor Laws">
        <Badge className="bg-red-500 hover:bg-red-600 text-white">
          FOMEMA • Levy • Permits
        </Badge>
      </AgentHeader>

      <div className="p-4 space-y-4">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-2">
          <p className="text-sm text-red-900 font-medium mb-1">Live Data:</p>
          <p className="text-xs text-red-800">
            Alerts: {complianceAgent.complianceQuery.data?.complianceStatus?.alerts?.length ?? 0}
          </p>
        </div>


        <Conversation className="h-80 border rounded-lg bg-white">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Ready for Compliance Check"
                description="Ask about FOMEMA, levy calculations, work permits, or EPF/SOCSO compliance"
                icon={<ShieldCheck className="h-8 w-8 text-red-600" />}
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Check FOMEMA compliance for 50 Bangladeshi workers",
                      )
                    }
                  >
                    FOMEMA Check
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Calculate monthly levy for construction sector",
                      )
                    }
                  >
                    Levy Calculator
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() =>
                      handlePromptSelect("EPF SOCSO PCB compliance check")
                    }
                  >
                    EPF/SOCSO
                  </Badge>
                    <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() =>
                      handlePromptSelect("Work permit renewal process")
                    }
                  >
                    Permit Renewal
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-green-100"
                    onClick={handleChecklist}
                  >
                    Generate Checklist (New Hook)
                  </Badge>
                </div>

              </ConversationEmptyState>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent className="flex items-start gap-2">
                  <AiMessageRow message={message} agent="compliance" />
                </MessageContent>
              </Message>
            ))}

            {isLoading && (
              <Reasoning>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bot className="w-4 h-4 animate-pulse" />
                  Analyzing compliance requirements...
                </div>
              </Reasoning>
            )}
          </ConversationContent>
        </Conversation>

        <div className="flex gap-2 pt-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Check permit expiry? Levy calculation? FOMEMA compliance?..."
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-1 border-red-200 focus:border-red-400"
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
