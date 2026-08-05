import { describe, expect, it } from "vitest";
import { resolveDocumentAIProvider } from "./provider";

describe("resolveDocumentAIProvider", () => {
  it("returns no provider when no credentials are configured", () => {
    expect(resolveDocumentAIProvider({})).toEqual({
      provider: "none",
      error: "No AI provider credentials are configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.",
    });
  });

  it("prefers OpenAI when requested and configured", () => {
    expect(resolveDocumentAIProvider({ provider: "openai", openAiKey: "sk-test" })).toEqual({
      provider: "openai",
    });
  });
});
