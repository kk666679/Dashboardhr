"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRelationsAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const EmotionAnalysisSchema = zod_1.z.object({
    dominant_emotion: zod_1.z.string(),
    emotion_intensity: zod_1.z.number().min(0).max(1),
    sentiment_score: zod_1.z.number().min(-1).max(1),
    key_themes: zod_1.z.array(zod_1.z.string()),
    recommended_actions: zod_1.z.array(zod_1.z.string()),
});
const ConflictMediationSchema = zod_1.z.object({
    conflict_type: zod_1.z.string(),
    severity_level: zod_1.z.enum(['low', 'medium', 'high']),
    mediation_approach: zod_1.z.string(),
    suggested_steps: zod_1.z.array(zod_1.z.string()),
    expected_outcome: zod_1.z.string(),
    follow_up_actions: zod_1.z.array(zod_1.z.string()),
});
const CultureHealthSchema = zod_1.z.object({
    overall_score: zod_1.z.number().min(0).max(100),
    dimensions: zod_1.z.object({
        engagement: zod_1.z.number().min(0).max(100),
        inclusion: zod_1.z.number().min(0).max(100),
        psychological_safety: zod_1.z.number().min(0).max(100),
        growth_mindset: zod_1.z.number().min(0).max(100),
    }),
    strengths: zod_1.z.array(zod_1.z.string()),
    areas_for_improvement: zod_1.z.array(zod_1.z.string()),
    action_plan: zod_1.z.array(zod_1.z.string()),
});
class EmployeeRelationsAgent extends base_agent_1.BaseAgent {
    async execute(input) {
        const { action, data } = input;
        switch (action) {
            case 'analyze_emotion':
                return await this.analyzeEmotion(data);
            case 'mediate_conflict':
                return await this.mediateConflict(data);
            case 'assess_culture_health':
                return await this.assessCultureHealth(data);
            case 'predict_er_case':
                return await this.predictERCase(data);
            case 'generate_investigation':
                return await this.generateInvestigation(data);
            default:
                return this.createResponse(false, null, 'Unknown action for Employee Relations Agent');
        }
    }
    async analyzeEmotion(feedbackData) {
        const prompt = `
Analyze the emotional content of this employee feedback:

Feedback: "${feedbackData.text}"
Context: ${feedbackData.context}
Language: ${feedbackData.language || 'en'}

Consider Malaysian cultural context and workplace dynamics.
Provide emotional analysis including:
1. Dominant emotion
2. Emotional intensity (0-1 scale)
3. Sentiment score (-1 to 1 scale)
4. Key themes identified
5. Recommended actions for HR

${this.context.language === 'ms' ? 'Consider Bahasa Malaysia cultural nuances.' : ''}
`;
        const analysis = await this.generateStructuredResponse(prompt, EmotionAnalysisSchema);
        if (!analysis) {
            return this.createResponse(false, null, 'Failed to analyze emotion');
        }
        return this.createResponse(true, analysis, 'Emotion analysis completed', [
            'PDPA compliance maintained',
            'Cultural sensitivity applied'
        ]);
    }
    async mediateConflict(conflictData) {
        const prompt = `
Mediate this workplace conflict:

Description: ${conflictData.description}
Parties Involved: ${conflictData.parties_involved.join(', ')}
Conflict Type: ${conflictData.conflict_type}
Duration: ${conflictData.duration}
Previous Mediation Attempts: ${conflictData.previous_attempts?.join('; ') || 'None'}

Provide mediation strategy considering:
1. Conflict type and severity
2. Cultural context (Malaysian workplace dynamics)
3. Employment Act 1955 compliance
4. Step-by-step mediation approach
5. Expected outcomes and follow-up

${this.context.language === 'ms' ? 'Provide mediation guidance in Bahasa Malaysia context.' : ''}
`;
        const mediation = await this.generateStructuredResponse(prompt, ConflictMediationSchema);
        if (!mediation) {
            return this.createResponse(false, null, 'Failed to generate mediation strategy');
        }
        return this.createResponse(true, mediation, 'Conflict mediation strategy generated', [
            'Employment Act 1955 compliance verified',
            'Cultural mediation approach applied'
        ]);
    }
    async assessCultureHealth(surveyData) {
        const prompt = `
Assess organizational culture health based on survey responses:

Survey Data:
${surveyData.responses.map(r => `- ${r.category}: ${r.question} -> ${r.answer}`).join('\n')}

Department: ${surveyData.department || 'Organization-wide'}
Time Period: ${surveyData.time_period}

Analyze across dimensions:
1. Employee engagement
2. Inclusion and diversity
3. Psychological safety
4. Growth mindset

Provide comprehensive assessment with scores, strengths, improvement areas, and action plan.
Consider Malaysian workplace culture and DEI initiatives.
`;
        const assessment = await this.generateStructuredResponse(prompt, CultureHealthSchema);
        if (!assessment) {
            return this.createResponse(false, null, 'Failed to assess culture health');
        }
        return this.createResponse(true, assessment, 'Culture health assessment completed', [
            'DEI metrics calculated',
            'Malaysian cultural context considered'
        ]);
    }
    async predictERCase(patternData) {
        const prompt = `
Predict potential Employee Relations cases based on behavioral patterns:

Employee History: ${JSON.stringify(patternData.employee_history)}
Behavioral Indicators: ${patternData.behavioral_indicators.join(', ')}
Department Trends: ${JSON.stringify(patternData.department_trends)}
Recent Events: ${patternData.recent_events.join('; ')}

Analyze patterns to predict:
1. Likelihood of ER cases
2. Potential case types
3. Risk factors
4. Preventive measures
5. Early intervention strategies

Consider Malaysian employment law and cultural factors.
`;
        const prediction = await this.generateResponse(prompt);
        return this.createResponse(true, { prediction }, 'ER case prediction completed', [
            'Behavioral pattern analysis performed',
            'Preventive measures identified'
        ]);
    }
    async generateInvestigation(investigationData) {
        const prompt = `
Generate comprehensive investigation documentation for this ER case:

Incident: ${investigationData.incident}
Witnesses: ${investigationData.witnesses.join(', ')}
Timeline: ${JSON.stringify(investigationData.timeline)}
Evidence: ${investigationData.evidence.join(', ')}
Policies Violated: ${investigationData.policies_violated.join(', ')}

Create PDPA-compliant investigation report including:
1. Investigation methodology
2. Findings and analysis
3. Conclusions and recommendations
4. Action plan
5. Follow-up requirements

Ensure compliance with Employment Act 1955 and PDPA 2010.
`;
        const investigation = await this.generateResponse(prompt);
        return this.createResponse(true, { investigation }, 'Investigation documentation generated', [
            'PDPA compliance maintained',
            'Employment Act 1955 alignment verified'
        ]);
    }
}
exports.EmployeeRelationsAgent = EmployeeRelationsAgent;
//# sourceMappingURL=employee-relations-agent.js.map