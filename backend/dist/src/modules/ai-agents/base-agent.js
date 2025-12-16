"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
class BaseAgent {
    constructor(context = {}) {
        this.model = (0, openai_1.openai)('gpt-4o');
        this.context = {
            language: 'en',
            compliance: true,
            ...context
        };
    }
    async generateResponse(prompt, options) {
        try {
            const result = await (0, ai_1.generateText)({
                model: this.model,
                prompt: this.buildPrompt(prompt),
                temperature: options?.temperature || 0.7,
            });
            return result.text;
        }
        catch (error) {
            console.error('AI generation error:', error);
            return 'Unable to generate response at this time.';
        }
    }
    async generateStructuredResponse(prompt, schema) {
        try {
            const result = await (0, ai_1.generateObject)({
                model: this.model,
                prompt: this.buildPrompt(prompt),
                schema,
            });
            return result.object;
        }
        catch (error) {
            console.error('Structured AI generation error:', error);
            return null;
        }
    }
    buildPrompt(basePrompt) {
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
    createResponse(success, data, message, complianceNotes) {
        return {
            success,
            data,
            message,
            compliance_notes: complianceNotes,
            confidence_score: success ? 0.85 : 0.5
        };
    }
}
exports.BaseAgent = BaseAgent;
//# sourceMappingURL=base-agent.js.map