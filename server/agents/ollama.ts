import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AGENT_PROMPTS } from "@/server/agents/prompts";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:1b";

export function createOllamaClient(model = OLLAMA_MODEL) {
  return new ChatOllama({
    model,
    baseUrl: OLLAMA_BASE_URL,
    temperature: 0.3,
    maxRetries: 2,
  });
}

export async function reasonWithOllama(
  input: string,
  context: string,
  persona: keyof typeof AGENT_PROMPTS = "orchestrator",
): Promise<string> {
  const llm = createOllamaClient();

  const messages = [
    new SystemMessage(AGENT_PROMPTS[persona]),
    new HumanMessage(
      `User Question: ${input}\n\nContext from HR Systems:\n${context || "No additional context."}\n\nProvide a comprehensive, Malaysian-law-aware response.`,
    ),
  ];

  const response = await llm.invoke(messages);
  return typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);
}

/**
 * RAG-augmented Ollama call.
 * Accepts pre-retrieved context chunks (from lib/rag.ts) and injects them
 * into the prompt before invoking the LLM.
 */
export async function ragWithOllama(
  input: string,
  chunks: Array<{ source: string; text: string; score: number }>,
  persona: keyof typeof AGENT_PROMPTS = "orchestrator",
): Promise<string> {
  const context = chunks.length
    ? chunks.map((c, i) => `[${i + 1}] ${c.source}\n${c.text}`).join("\n\n")
    : "No relevant HR records found.";
  return reasonWithOllama(input, context, persona);
}
