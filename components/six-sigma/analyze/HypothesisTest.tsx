"use client";

import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationTypingIndicator,
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  Controls,
  Suggestion,
  Suggestions,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "../../ai-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type TestType = "t-test" | "anova" | "chi-square" | "mann-whitney";

interface TestResult {
  testType: TestType;
  statistic: number;
  pValue: number;
  alpha: number;
  significant: boolean;
  conclusion: string;
  assumptions: string[];
}

// -----------------------------------------------------------------------------
// Mock Data / Helpers
// -----------------------------------------------------------------------------
const mockData = {
  "t-test": { statistic: 2.45, pValue: 0.018 },
  anova: { statistic: 3.87, pValue: 0.032 },
  "chi-square": { statistic: 5.63, pValue: 0.06 },
  "mann-whitney": { statistic: 1.98, pValue: 0.047 },
};

const testDescriptions: Record<TestType, string> = {
  "t-test": "Compare means of two groups (e.g., before/after improvement).",
  anova: "Compare means of three or more groups.",
  "chi-square": "Test association between categorical variables.",
  "mann-whitney": "Non-parametric alternative to t-test for two groups.",
};

const assumptionChecks: Record<TestType, string[]> = {
  "t-test": ["Normality", "Homogeneity of variance", "Independence"],
  anova: ["Normality", "Homogeneity of variance", "Independence"],
  "chi-square": ["Expected frequencies ≥5", "Independence"],
  "mann-whitney": ["Independence", "Shape of distributions (similar)"],
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function HypothesisTest() {
  const [testType, setTestType] = useState<TestType>("t-test");
  const [alpha, setAlpha] = useState(0.05);
  const [conversationMessages, setConversationMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "I can help you select and run a hypothesis test. What would you like to test?",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const runTest = () => {
    // Simulate calculation
    const mock = mockData[testType];
    const pValue = mock.pValue + (Math.random() - 0.5) * 0.02; // slight variation
    const stat = mock.statistic + (Math.random() - 0.5) * 0.3;
    const significant = pValue < alpha;
    const conclusion = significant
      ? `Reject null hypothesis: significant effect detected (p = ${pValue.toFixed(3)}).`
      : `Fail to reject null hypothesis: no significant effect (p = ${pValue.toFixed(3)}).`;

    setResult({
      testType,
      statistic: stat,
      pValue: Math.max(0, Math.min(1, pValue)),
      alpha,
      significant,
      conclusion,
      assumptions: assumptionChecks[testType],
    });

    // Add AI suggestion
    setIsThinking(true);
    setTimeout(() => {
      setConversationMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: significant
            ? `✅ The ${testType} indicates a significant result. Consider investigating the root cause further.`
            : `ℹ️ The ${testType} did not show significance. You might want to increase sample size or check assumptions.`,
        },
      ]);
      setIsThinking(false);
    }, 800);
  };

  const handleSend = (msg: string) => {
    const userMsg = { role: "user", content: msg };
    setConversationMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setTimeout(() => {
      const response = {
        role: "assistant",
        content:
          "I've noted your request. I can guide you through test selection and interpretation. Try selecting a test type and setting alpha, then click 'Run Test'.",
      };
      setConversationMessages((prev) => [...prev, response]);
      setIsThinking(false);
    }, 1000);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Hypothesis Testing</h2>
        <p className="text-sm text-muted-foreground">
          Select a test, set significance level, and get AI‑assisted interpretation.
        </p>
      </div>

      {/* Reasoning & Controls */}
      <div className="grid gap-4 md:grid-cols-2">
        <Reasoning>
          <ReasoningTrigger />
          <ReasoningContent>Define null and alternative hypotheses. Check assumptions for the selected test. Compute test statistic and p‑value. Compare p‑value to alpha and conclude.</ReasoningContent>
        </Reasoning>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Controls</CardTitle>
            <CardDescription>Configure your test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="test-type">Test Type</Label>
              <Select value={testType} onValueChange={(v) => setTestType(v as TestType)}>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t-test">t‑Test (two groups)</SelectItem>
                  <SelectItem value="anova">ANOVA (≥3 groups)</SelectItem>
                  <SelectItem value="chi-square">Chi‑Square (categorical)</SelectItem>
                  <SelectItem value="mann-whitney">Mann‑Whitney U (non‑parametric)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {testDescriptions[testType]}
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="alpha">Significance Level (α)</Label>
              <Input
                id="alpha"
                type="number"
                step="0.01"
                min="0.01"
                max="0.10"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.05)}
              />
            </div>
            <Button className="w-full" onClick={runTest}>
              Run Test
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Results – {result.testType}
              {result.significant ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="size-3" /> Significant
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="size-3" /> Not Significant
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border p-2">
                <div className="text-xs text-muted-foreground">Statistic</div>
                <div className="font-mono text-sm">{result.statistic.toFixed(3)}</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-xs text-muted-foreground">p‑value</div>
                <div className="font-mono text-sm">{result.pValue.toFixed(3)}</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-xs text-muted-foreground">α</div>
                <div className="font-mono text-sm">{result.alpha.toFixed(2)}</div>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p>{result.conclusion}</p>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Assumptions checked:
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {result.assumptions.map((a) => (
                  <Badge key={a} variant="outline" className="text-xs">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestion for next steps */}
      {result && (
        <Suggestions>
          <Suggestion
            suggestion={
              result.significant
                ? "Investigate the factor causing the difference – use a control chart for follow-up."
                : "Consider increasing sample size or using a more sensitive test."
            }
            variant="outline"
          />
        </Suggestions>
      )}

      {/* AI Conversation Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Hypothesis Assistant</CardTitle>
          <CardDescription>Ask for advice on test selection or interpretation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            <Conversation>
              <ConversationContent>
                {conversationMessages.length === 0 ? (
                  <ConversationEmptyState
                    title="No messages yet"
                    description="Start a conversation about hypothesis testing."
                  />
                ) : (
                  <div className="space-y-3">
                    {conversationMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isThinking && (
                      <ConversationTypingIndicator label="Assistant is thinking..." />
                    )}
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about hypothesis testing..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleSend(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              size="sm"
              onClick={(e) => {
                const input = (e.target as HTMLElement)
                  .previousElementSibling as HTMLInputElement;
                if (input?.value.trim()) {
                  handleSend(input.value);
                  input.value = "";
                }
              }}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Statistical Methods Handbook" href="/dashboard/documents/repository" />
          <Source title="Sample Data – Q2 2026" href="/dashboard/reports/workforce" />
        </SourcesContent>
      </Sources>
    </div>
  );
}