export type DocumentAIProvider = "claude" | "openai" | "none";

export interface ResolvedDocumentAIProvider {
  provider: DocumentAIProvider;
  error?: string;
}

export function resolveDocumentAIProvider(options: {
  provider?: "claude" | "openai";
  claudeKey?: string;
  openAiKey?: string;
}): ResolvedDocumentAIProvider {
  const hasClaude = Boolean(options.claudeKey?.trim()?.startsWith("sk-ant-"));
  const hasOpenAi = Boolean(options.openAiKey?.trim()?.startsWith("sk-"));

  if (options.provider === "claude") {
    return hasClaude
      ? { provider: "claude" }
      : {
          provider: hasOpenAi ? "openai" : "none",
          error: "Anthropic credentials are not configured.",
        };
  }

  if (options.provider === "openai") {
    return hasOpenAi
      ? { provider: "openai" }
      : {
          provider: hasClaude ? "claude" : "none",
          error: "OpenAI credentials are not configured.",
        };
  }

  if (hasClaude) {
    return { provider: "claude" };
  }

  if (hasOpenAi) {
    return { provider: "openai" };
  }

  return {
    provider: "none",
    error: "No AI provider credentials are configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.",
  };
}
