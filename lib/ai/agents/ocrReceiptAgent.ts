/**
 * OCR Receipt Agent — Sprint 19, Task 19.3
 * Extracts structured fields from receipt images using AI provider fallback.
 * Merchant, date, amount, currency pre-populated within 15s (Req 16.2).
 * Requirements: 16.2, 23.x
 */
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export interface ReceiptData {
  merchant?: string;
  date?: string;
  amount?: number;
  currency?: string;
  category?: string;
  description?: string;
  confidence: number; // 0–100
}

const RECEIPT_PROMPT = (text: string) => `
Extract information from this receipt text and return ONLY valid JSON:
{
  "merchant": "string or null",
  "date": "YYYY-MM-DD or null",
  "amount": number or null,
  "currency": "MYR" or "USD" etc,
  "category": "MEDICAL|TRAVEL|ENTERTAINMENT|MISCELLANEOUS",
  "description": "brief description",
  "confidence": 0-100
}

Receipt text:
${text.slice(0, 3000)}
`;

export async function parseReceipt(receiptText: string): Promise<ReceiptData> {
  const prompt = RECEIPT_PROMPT(receiptText);

  for (const call of [
    () => generateText({ model: openai("gpt-4o-mini"), prompt }),
    () => generateText({ model: anthropic("claude-3-haiku-20240307"), prompt }),
  ]) {
    try {
      const result = await call();
      const clean = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean) as ReceiptData;
      return { currency: "MYR", ...parsed, confidence: parsed.confidence ?? 70 };
    } catch {}
  }

  return { confidence: 0, description: "OCR parsing failed — please enter manually" };
}
