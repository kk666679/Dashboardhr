import type { SopGenerationInput } from "@/lib/sop-schemas";

/**
 * Minimal input adapters for MVP.
 * For now, we map various source texts/prompts into the shared SopGenerationInput.
 */

export function promptToSopInput(input: {
  department: string;
  category: string;
  processDescription: string;
  prompt: string;
  code?: string;
  title?: string;
}): SopGenerationInput {
  const { department, category, processDescription, prompt, code, title } = input;
  return {
    department,
    category,
    processDescription,
    prompt,
    code,
    title,
  };
}

export function policyToSopInput(input: {
  department: string;
  category: string;
  processDescription: string;
  policyText: string;
  code?: string;
  title?: string;
}): SopGenerationInput {
  const { department, category, processDescription, policyText, code, title } = input;
  return {
    department,
    category,
    processDescription,
    policyText,
    code,
    title,
  };
}

export function regulationToSopInput(input: {
  department: string;
  category: string;
  processDescription: string;
  regulationText: string;
  code?: string;
  title?: string;
}): SopGenerationInput {
  const { department, category, processDescription, regulationText, code, title } = input;
  return {
    department,
    category,
    processDescription,
    regulationText,
    code,
    title,
  };
}

