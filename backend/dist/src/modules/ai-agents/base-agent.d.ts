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
export declare abstract class BaseAgent {
    protected model: import("@ai-sdk/provider").LanguageModelV2;
    protected context: AgentContext;
    constructor(context?: AgentContext);
    protected generateResponse(prompt: string, options?: {
        temperature?: number;
    }): Promise<string>;
    protected generateStructuredResponse<T>(prompt: string, schema: any): Promise<T | null>;
    private buildPrompt;
    abstract execute(input: any): Promise<AgentResponse>;
    protected createResponse(success: boolean, data?: any, message?: string, complianceNotes?: string[]): AgentResponse;
}
