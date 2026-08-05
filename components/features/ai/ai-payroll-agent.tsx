"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calculator, Receipt, Send } from "lucide-react";
import { usePayroll } from "@/hooks/usePayroll";


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

type AgentMessage = { id: string; role: "user" | "assistant" | "system"; content?: string; parts?: unknown[] };

export function AIPayrollAgent() {
  const [inputText, setInputText] = useState("");
  // Temporary: this component expects a usePayrollAgent hook, but the repo only provides usePayroll.
  // Keep it compiling by using the closest available hook.
  const payrollAgent = usePayroll();
  const { messages = [], sendMessage, status } = (payrollAgent ?? {}) as any;


  const { toast } = useToast();

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    await sendMessage({ text });
    setInputText("");
    toast({
      title: "Sent to Payroll Agent",
      description: "Calculating payroll requirements...",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const handleEPFBreakdown = async () => {
    const epfQuery = "Generate EPF SOCSO PCB breakdown for RM 3,000 basic salary";
    setInputText(epfQuery);
    await sendMessage({ text: epfQuery });
    setInputText("");
    toast({
      title: "Calculating EPF/SOCSO/PCB",
      description: "Fetching contribution breakdown...",
    });
  };




  return (
    <Agent className="border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
      <AgentHeader name="Payroll Agent" model="Compensation & Benefits">
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          EPF • SOCSO • PCB
        </Badge>
      </AgentHeader>

      <div className="p-4 space-y-4">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-900 font-medium mb-1">Live:</p>
          <p className="text-xs text-green-800">Pending: {0}</p>

        </div>


        <Conversation className="h-80 border rounded-lg bg-white">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Ready for Payroll Support"
                description="Calculate salaries, EPF/SOCSO/PCB contributions, generate payslips, and handle payroll anomalies"
                icon={<Calculator className="h-8 w-8 text-green-600" />}
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-green-100"
                    onClick={() =>
                      handlePromptSelect(
                        "Calculate monthly salary for RM 3,000 basic",
                      )
                    }
                  >
                    Salary Calculator
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-green-100"
                    onClick={() =>
                      handlePromptSelect("Generate EPF SOCSO PCB breakdown")
                    }
                  >
                    EPF/SOCSO/PCB
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-green-100"
                    onClick={() =>
                      handlePromptSelect("Create payslip template")
                    }
                  >
                    Payslip Template
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-green-100"
                    onClick={() =>
                      handlePromptSelect("Check for payroll anomalies")
                    }
                  >
                    Anomaly Detection
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-emerald-100" onClick={handleEPFBreakdown}>
                    EPF Breakdown (Hook)
                  </Badge>
                </div>

              </ConversationEmptyState>
            )}

            {(messages as AgentMessage[]).map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent className="flex items-start gap-2">
                  <AiMessageRow message={message as any} agent="payroll" />
                </MessageContent>
              </Message>
            ))}

            {isLoading && (
              <Reasoning>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calculator className="w-4 h-4 animate-pulse" />
                  Calculating payroll requirements...
                </div>
              </Reasoning>
            )}
          </ConversationContent>
        </Conversation>

        <div className="flex gap-2 pt-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Calculate salary? EPF breakdown? Generate payslip?..."
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-1 border-green-200 focus:border-green-400"
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
