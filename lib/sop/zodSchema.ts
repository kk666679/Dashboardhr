import { z } from "zod";

import { SopStructureSchema } from "@/lib/sop-schemas";

// AUTO-FLAG: TODO - needs implementation
// NOTE: This file exists because TODO.md referenced a planned zod schema module.
// The canonical SOP structured output schema already lives in lib/sop-schemas.ts.
// This module re-exports/aliases it so call-sites can import from lib/sop/zodSchema.

export const SopZodSchema = z.object({
  sopCode: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1),
  category: z.string().min(1),
  version: z.number().int().nonnegative(),
  status: z.string().min(1),
  structure: SopStructureSchema,
  artifacts: z.object({
    mermaid: z.string().optional(),
    markdown: z.string().optional(),
    html: z.string().optional(),
  }),
  agentFindings: z.object({
    complianceScore: z.number().int().min(0).max(100).optional(),
    riskScore: z.number().int().min(0).max(100).optional(),
    auditReadinessScore: z.number().int().min(0).max(100).optional(),
    issues: z.array(z.string()).default([]),
  }),
});

export type SopZod = z.infer<typeof SopZodSchema>;

