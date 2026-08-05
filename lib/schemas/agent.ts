/**
 * lib/schemas/agent.ts
 * Agent / orchestrator output schemas.
 */
import { z } from "zod";

export const AgentOutputSchema = z.object({
  type: z.string(),
  message: z.string(),
  source: z.string().optional(),
});

export type AgentOutput = z.infer<typeof AgentOutputSchema>;

export const HRAgentResultSchema = z.object({
  raw: z.array(AgentOutputSchema),
  final: z.string(),
});

export type HRAgentResult = z.infer<typeof HRAgentResultSchema>;
