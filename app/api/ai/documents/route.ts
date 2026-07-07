import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { AIDocRequestSchema } from "@/types/ai-docs";
import { PDFGenerator } from "@/utils/pdf/pdf-generator";
import type { DeliveryOrderPDFData } from "@/utils/pdf/delivery-order-pdf";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert Malaysian HR document generator. Generate COMPLETE, accurate, compliant JSON data: {"data": {...}} ONLY.

RULES:
1. JSON ONLY - no markdown/explanations
2. Malaysian compliance: EPF(11%/12%), SOCSO, EIS(0.2%), Levy(RM154.17), SST(6%)
3. Fill ALL required fields with realistic data
4. Match schema exactly

Types:
- invoice: {invoiceNumber, customerName, total, items[]}
- payslip: {workerName, payPeriod, basicSalary, netPay}
- permit: {permitNumber, workerName, employerName}
- report: {reportType, period}
- delivery-order: Full delivery order structure`;

export async function POST(req: NextRequest) {
  try {
    const body = AIDocRequestSchema.parse(await req.json());
    const { docType, context, instructions, provider } = body;

    const claudeKey = process.env.ANTHROPIC_API_KEY?.trim();
    const hasClaude = Boolean(claudeKey?.startsWith("sk-ant-"));

    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    const hasOpenAi = Boolean(openAiKey?.startsWith("sk-"));

    // Determine provider: explicit > Claude > OpenAI
    const selectedProvider = provider === "claude" && hasClaude ? "claude" : "openai";

    let text: string;
    if (selectedProvider === "claude") {
      const claude = createAnthropic({ apiKey: claudeKey });
      const result = await generateText({
        model: claude("claude-3-5-sonnet-20241022"),
        system: SYSTEM_PROMPT,
        prompt: `DocType: ${docType}\nContext: ${JSON.stringify(context)}\nInstructions: ${instructions}`,
        temperature: 0.1,
      });
      text = result.text;
    } else {
      const openai = createOpenAI({ apiKey: openAiKey });
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: SYSTEM_PROMPT,
        prompt: `DocType: ${docType}\nContext: ${JSON.stringify(context)}\nInstructions: ${instructions}`,
        temperature: 0.1,
      });
      text = result.text;
    }

    const { data } = JSON.parse(text);

    let pdfBlob: Blob;
    if (docType === "delivery-order") {
      const { DeliveryOrderPDFGenerator } =
        await import("@/utils/pdf/delivery-order-pdf");
      pdfBlob = await DeliveryOrderPDFGenerator.generatePDF(
        data as DeliveryOrderPDFData,
      );
    } else {
      // AIDocResponse['data'] discriminated union — cast is safe: docType is narrowed by the branch above
      pdfBlob = await PDFGenerator.generatePDF({ docType, data } as Parameters<
        typeof PDFGenerator.generatePDF
      >[0]);
    }

    const base64 = Buffer.from(await pdfBlob.arrayBuffer()).toString("base64");

    return NextResponse.json({ success: true, pdfBase64: base64, data, provider: selectedProvider });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI Doc Gen failed:", error);
    return NextResponse.json(
      { error: "Document generation failed", details: message },
      { status: 500 },
    );
  }
}
