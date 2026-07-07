"use server";

import { ragQuery } from "@/lib/rag";

export async function askKnowledgeBase(query: string, tenantId?: string) {
  try {
    const result = await ragQuery(query, {
      tenantId,
      persona: "orchestrator",
    });

    return {
      answer: result.answer,
      chunks: result.chunks.map(({ source, score }) => ({
        source,
        score,
      })),
    };
  } catch (error) {
    console.error("KB query error:", error);

    return {
      answer:
        "Sorry, I encountered an error while searching the knowledge base. Please try again.",
      chunks: [],
    };
  }
}