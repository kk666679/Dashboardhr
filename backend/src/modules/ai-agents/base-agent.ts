import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface AgentContext {
  userId?: string;
  tenantId?: string;
  language?: 'en' | 'ms';
  compliance?: boolean;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  message?: string;
  compliance_notes?: string[];
  confidence_score?: number;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  message?: string;
  compliance_notes?: string[];
  confidence_score?: number;
}

export abstract class BaseAgent {
  protected model = openai('gpt-4o');
  protected context: AgentContext;

  constructor(context: AgentContext = {}) {
    this.context = {
      language: 'en',
      compliance: true,
      ...context
    };
  }

  protected async generateResponse(
    prompt: string,
    options?: { temperature?: number }
  ): Promise<string> {
    try {
      const result = await generateText({
        model: this.model,
        prompt: this.buildPrompt(prompt),
        temperature: options?.temperature || 0.7,
      });

      return result.text;
    } catch (error) {
      console.error('AI generation error:', error);
      return 'Unable to generate response at this time.';
    }
  }

  protected async generateStructuredResponse<T>(
    prompt: string,
    schema: any
  ): Promise<T | null> {
    try {
      const result = await generateObject({
        model: this.model,
        prompt: this.buildPrompt(prompt),
        schema,
      });

      return result.object as T;
    } catch (error) {
      console.error('Structured AI generation error:', error);
      return null;
    }
  }

  private buildPrompt(basePrompt: string): string {
    const malaysianContext = `
You are an AI agent operating in the Malaysian HR context. Consider:
- Malaysian labor laws (Employment Act 1955, Industrial Relations Act 1967)
- Islamic finance principles and Zakat calculations
- Multi-cultural workforce (Malay, Chinese, Indian, Foreign workers)
- Bahasa Malaysia language support
- Local compliance requirements (EPF, SOCSO, LHDN, PDPA)

Current context:
- Language: ${this.context.language}
- Compliance mode: ${this.context.compliance ? 'Enabled' : 'Disabled'}
- Tenant: ${this.context.tenantId || 'Default'}
`;

    return `${malaysianContext}\n\n${basePrompt}`;
  }

  abstract execute(input: any): Promise<AgentResponse>;

  protected createResponse(
    success: boolean,
    data?: any,
    message?: string,
    complianceNotes?: string[]
  ): AgentResponse {
    return {
      success,
      data,
      message,
      compliance_notes: complianceNotes,
      confidence_score: success ? 0.85 : 0.5
    };
  }
}
