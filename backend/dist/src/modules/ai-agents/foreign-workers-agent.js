"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignWorkersAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const PermitRenewalSchema = zod_1.z.object({
    renewal_required: zod_1.z.boolean(),
    renewal_date: zod_1.z.string(),
    documents_needed: zod_1.z.array(zod_1.z.string()),
    risk_assessment: zod_1.z.enum(['low', 'medium', 'high']),
    recommended_actions: zod_1.z.array(zod_1.z.string()),
    compliance_status: zod_1.z.string(),
});
const ComplianceRiskSchema = zod_1.z.object({
    overall_risk: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    risk_factors: zod_1.z.array(zod_1.z.object({
        factor: zod_1.z.string(),
        severity: zod_1.z.enum(['low', 'medium', 'high']),
        mitigation: zod_1.z.string(),
    })),
    compliance_score: zod_1.z.number().min(0).max(100),
    priority_actions: zod_1.z.array(zod_1.z.string()),
});
const MultiLanguageCommunicationSchema = zod_1.z.object({
    detected_language: zod_1.z.string(),
    translated_message: zod_1.z.string(),
    cultural_notes: zod_1.z.array(zod_1.z.string()),
    recommended_response: zod_1.z.string(),
    urgency_level: zod_1.z.enum(['low', 'medium', 'high']),
});
class ForeignWorkersAgent extends base_agent_1.BaseAgent {
    async execute(input) {
        const { action, data } = input;
        switch (action) {
            case 'predict_permit_renewal':
                return await this.predictPermitRenewal(data);
            case 'assess_compliance_risk':
                return await this.assessComplianceRisk(data);
            case 'translate_communication':
                return await this.translateCommunication(data);
            case 'analyze_agency_performance':
                return await this.analyzeAgencyPerformance(data);
            case 'optimize_levy_calculations':
                return await this.optimizeLevyCalculations(data);
            default:
                return this.createResponse(false, null, 'Unknown action for Foreign Workers Agent');
        }
    }
    async predictPermitRenewal(workerData) {
        const prompt = `
Predict permit renewal requirements for this foreign worker:

Worker ID: ${workerData.worker_id}
Permit Type: ${workerData.permit_type}
Expiry Date: ${workerData.expiry_date}
Nationality: ${workerData.nationality}
Employment Status: ${workerData.employment_status}

Analyze considering Malaysian Immigration regulations and provide:
1. Whether renewal is required
2. Recommended renewal date
3. Required documents
4. Risk assessment
5. Compliance status

Consider specific requirements for different nationalities and permit types.
`;
        const prediction = await this.generateStructuredResponse(prompt, PermitRenewalSchema);
        if (!prediction) {
            return this.createResponse(false, null, 'Failed to predict permit renewal');
        }
        return this.createResponse(true, prediction, 'Permit renewal prediction completed', [
            'Immigration Act compliance verified',
            'MOHR regulations considered'
        ]);
    }
    async assessComplianceRisk(workerData) {
        const prompt = `
Assess compliance risk for foreign workers in this department:

Department: ${workerData.department}
Workers Data:
${workerData.workers.map(w => `- ${w.id}: Permit=${w.permit_status}, Medical=${w.medical_status}, Accommodation=${w.accommodation}, Last Inspection=${w.last_inspection}`).join('\n')}

Recent Changes: ${workerData.recent_changes.join('; ')}

Evaluate compliance with:
- Immigration Act requirements
- FOMEMA medical screening
- Workers' Minimum Standards of Housing and Amenities Act
- Employment of Foreign Workers Act

Provide risk assessment and mitigation strategies.
`;
        const assessment = await this.generateStructuredResponse(prompt, ComplianceRiskSchema);
        if (!assessment) {
            return this.createResponse(false, null, 'Failed to assess compliance risk');
        }
        return this.createResponse(true, assessment, 'Compliance risk assessment completed', [
            'Multiple regulatory frameworks considered',
            'Risk mitigation strategies provided'
        ]);
    }
    async translateCommunication(communicationData) {
        const languageNames = {
            en: 'English',
            ms: 'Bahasa Malaysia',
            zh: 'Chinese',
            ta: 'Tamil',
            bn: 'Bengali',
            ne: 'Nepali',
            id: 'Indonesian'
        };
        const prompt = `
Translate and analyze this communication for foreign worker engagement:

Original Message: "${communicationData.message}"
Detected Source Language: ${communicationData.source_language || 'Auto-detect'}
Target Language: ${languageNames[communicationData.target_language]}
Context: ${communicationData.context}
Urgency Level: ${communicationData.urgency || 'medium'}

Provide:
1. Detected source language
2. Accurate translation
3. Cultural context notes
4. Recommended response approach
5. Urgency assessment

Consider cultural sensitivities and workplace communication norms.
`;
        const translation = await this.generateStructuredResponse(prompt, MultiLanguageCommunicationSchema);
        if (!translation) {
            return this.createResponse(false, null, 'Failed to translate communication');
        }
        return this.createResponse(true, translation, 'Communication translation completed', [
            'Cultural sensitivity applied',
            'Multi-language support enabled'
        ]);
    }
    async analyzeAgencyPerformance(agencyData) {
        const prompt = `
Analyze performance of this foreign worker recruitment agency:

Agency: ${agencyData.agency_name}
Workers Placed: ${agencyData.workers_placed}
Compliance Rate: ${agencyData.compliance_rate}%
Feedback Scores: ${agencyData.feedback_scores.join(', ')}
Incidents: ${agencyData.incidents.join('; ')}
Contract Period: ${agencyData.contract_period}

Evaluate:
1. Overall performance rating
2. Compliance effectiveness
3. Worker satisfaction metrics
4. Risk factors
5. Recommendations for contract renewal or termination

Consider MOHR licensing requirements and industry standards.
`;
        const analysis = await this.generateResponse(prompt);
        return this.createResponse(true, { analysis }, 'Agency performance analysis completed', [
            'MOHR compliance standards applied',
            'Performance metrics evaluated'
        ]);
    }
    async optimizeLevyCalculations(levyData) {
        const prompt = `
Optimize levy calculations for foreign workers:

Current Setup:
- Worker Count: ${levyData.worker_count}
- Sectors: ${levyData.sectors.join(', ')}
- Current Rates: ${JSON.stringify(levyData.current_rates)}
- Forecasted Hiring: ${levyData.forecasted_hiring}

Payment History: ${JSON.stringify(levyData.payment_history)}

Provide optimization recommendations including:
1. Cost-saving strategies
2. Sector-specific optimizations
3. Forecasting accuracy
4. Compliance with levy requirements
5. Budget planning recommendations

Consider Employment of Foreign Workers Act requirements.
`;
        const optimization = await this.generateResponse(prompt);
        return this.createResponse(true, optimization, 'Levy calculation optimization completed', [
            'Cost optimization strategies provided',
            'Regulatory compliance maintained'
        ]);
    }
}
exports.ForeignWorkersAgent = ForeignWorkersAgent;
//# sourceMappingURL=foreign-workers-agent.js.map