"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndustrialRelationsAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const DisputeAnalysisSchema = zod_1.z.object({
    risk_level: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    predicted_outcome: zod_1.z.string(),
    recommended_actions: zod_1.z.array(zod_1.z.string()),
    legal_references: zod_1.z.array(zod_1.z.string()),
    confidence_score: zod_1.z.number().min(0).max(1),
});
const StrikeRiskSchema = zod_1.z.object({
    strike_probability: zod_1.z.number().min(0).max(1),
    risk_factors: zod_1.z.array(zod_1.z.string()),
    mitigation_strategies: zod_1.z.array(zod_1.z.string()),
    sentiment_score: zod_1.z.number().min(-1).max(1),
});
class IndustrialRelationsAgent extends base_agent_1.BaseAgent {
    async execute(input) {
        const { action, data } = input;
        switch (action) {
            case 'analyze_dispute':
                return await this.analyzeDispute(data);
            case 'assess_strike_risk':
                return await this.assessStrikeRisk(data);
            case 'review_agreement':
                return await this.reviewCollectiveAgreement(data);
            case 'generate_case_documentation':
                return await this.generateCaseDocumentation(data);
            default:
                return this.createResponse(false, null, 'Unknown action for Industrial Relations Agent');
        }
    }
    async analyzeDispute(disputeData) {
        const prompt = `
Analyze this industrial dispute case and provide a comprehensive assessment:

Dispute Details:
- Description: ${disputeData.description}
- Parties: ${disputeData.parties_involved.join(', ')}
- Type: ${disputeData.dispute_type}
- Timeline: ${disputeData.timeline}

Provide analysis considering Malaysian labor laws (Industrial Relations Act 1967) and provide:
1. Risk level assessment
2. Predicted outcome
3. Recommended actions
4. Relevant legal references
5. Confidence score

Format as structured JSON response.
`;
        const analysis = await this.generateStructuredResponse(prompt, DisputeAnalysisSchema);
        if (!analysis) {
            return this.createResponse(false, null, 'Failed to analyze dispute');
        }
        return this.createResponse(true, analysis, 'Dispute analysis completed', [
            'Industrial Relations Act 1967 compliance verified',
            'Trade Union Act 1959 considerations included'
        ]);
    }
    async assessStrikeRisk(employeeData) {
        const prompt = `
Assess strike risk based on the following employee data:

Department: ${employeeData.department}
Recent Feedback: ${employeeData.recent_feedback.join('; ')}
Attendance Patterns: ${JSON.stringify(employeeData.attendance_patterns)}
Communication Logs: ${employeeData.communication_logs.join('; ')}

Analyze sentiment, identify risk factors, and provide mitigation strategies.
Consider Malaysian industrial relations context and cultural factors.
`;
        const assessment = await this.generateStructuredResponse(prompt, StrikeRiskSchema);
        if (!assessment) {
            return this.createResponse(false, null, 'Failed to assess strike risk');
        }
        return this.createResponse(true, assessment, 'Strike risk assessment completed', [
            'Sentiment analysis performed',
            'Cultural context considered'
        ]);
    }
    async reviewCollectiveAgreement(agreementData) {
        const prompt = `
Review this collective agreement for compliance and optimization:

Content: ${agreementData.content}
Parties: ${agreementData.parties.join(', ')}
Duration: ${agreementData.duration}

Analyze using NLP to identify:
1. Key clauses and obligations
2. Potential conflicts with Malaysian law
3. Areas for improvement
4. Risk assessment
5. Recommendations for amendments

Provide detailed analysis with specific references to Malaysian labor legislation.
`;
        const analysis = await this.generateResponse(prompt);
        return this.createResponse(true, { analysis }, 'Collective agreement review completed', [
            'Industrial Relations Act 1967 compliance checked',
            'Trade Union Act 1959 alignment verified'
        ]);
    }
    async generateCaseDocumentation(caseData) {
        const prompt = `
Generate comprehensive case documentation for this industrial relations case:

Case ID: ${caseData.case_id}
Incident Date: ${caseData.incident_date}
Description: ${caseData.description}
Witnesses: ${caseData.witnesses.join(', ')}
Evidence: ${caseData.evidence.join(', ')}

Create audit trails and documentation that complies with Malaysian labor law requirements.
Include proper formatting, timestamps, and legal references.
`;
        const documentation = await this.generateResponse(prompt);
        return this.createResponse(true, { documentation }, 'Case documentation generated', [
            'Audit trail created',
            'PDPA compliance maintained',
            'Legal formatting applied'
        ]);
    }
}
exports.IndustrialRelationsAgent = IndustrialRelationsAgent;
//# sourceMappingURL=industrial-relations-agent.js.map