"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceManagementAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const OKRTrackingSchema = zod_1.z.object({
    progress_score: zod_1.z.number().min(0).max(100),
    key_results_status: zod_1.z.array(zod_1.z.object({
        objective: zod_1.z.string(),
        key_result: zod_1.z.string(),
        progress: zod_1.z.number().min(0).max(100),
        status: zod_1.z.enum(['on_track', 'at_risk', 'behind', 'completed']),
        blockers: zod_1.z.array(zod_1.z.string()),
    })),
    predictive_insights: zod_1.z.array(zod_1.z.string()),
    recommended_actions: zod_1.z.array(zod_1.z.string()),
});
const FeedbackAnalysisSchema = zod_1.z.object({
    sentiment_score: zod_1.z.number().min(-1).max(1),
    themes_identified: zod_1.z.array(zod_1.z.object({
        theme: zod_1.z.string(),
        frequency: zod_1.z.number(),
        sentiment: zod_1.z.enum(['positive', 'neutral', 'negative']),
        representative_quotes: zod_1.z.array(zod_1.z.string()),
    })),
    actionable_insights: zod_1.z.array(zod_1.z.string()),
    bias_indicators: zod_1.z.array(zod_1.z.string()),
    improvement_suggestions: zod_1.z.array(zod_1.z.string()),
});
const NineBoxAnalysisSchema = zod_1.z.object({
    position: zod_1.z.object({
        performance_level: zod_1.z.enum(['low', 'medium', 'high']),
        potential_level: zod_1.z.enum(['low', 'medium', 'high']),
        quadrant: zod_1.z.string(),
    }),
    development_recommendations: zod_1.z.array(zod_1.z.string()),
    career_path_suggestions: zod_1.z.array(zod_1.z.string()),
    risk_assessment: zod_1.z.string(),
    timeline: zod_1.z.string(),
});
class PerformanceManagementAgent extends base_agent_1.BaseAgent {
    async execute(input) {
        const { action, data } = input;
        switch (action) {
            case 'track_okr':
                return await this.trackOKR(data);
            case 'analyze_feedback':
                return await this.analyzeFeedback(data);
            case 'assess_nine_box':
                return await this.assessNineBox(data);
            case 'simulate_career_path':
                return await this.simulateCareerPath(data);
            case 'detect_bias':
                return await this.detectBias(data);
            default:
                return this.createResponse(false, null, 'Unknown action for Performance Management Agent');
        }
    }
    async trackOKR(okrData) {
        const prompt = `
Track OKR progress with predictive analytics:

Employee: ${okrData.employee_id}
Objectives and Key Results:
${okrData.objectives.map(obj => `
Objective: ${obj.objective}
Key Results: ${obj.key_results.join(', ')}
Current Progress: ${obj.current_progress.join('%, ')}%
Target Date: ${obj.target_date}
`).join('\n')}

Recent Updates: ${okrData.recent_updates.join('; ')}

Provide comprehensive tracking including:
1. Overall progress score
2. Individual key result status
3. Predictive insights for completion
4. Blockers identification
5. Recommended interventions

Consider Malaysian performance management standards and MSC Malaysia frameworks.
`;
        const tracking = await this.generateStructuredResponse(prompt, OKRTrackingSchema);
        if (!tracking) {
            return this.createResponse(false, null, 'Failed to track OKR progress');
        }
        return this.createResponse(true, tracking, 'OKR tracking completed', [
            'Predictive analytics applied',
            'MSC Malaysia standards considered'
        ]);
    }
    async analyzeFeedback(feedbackData) {
        const prompt = `
Analyze 360° feedback for performance insights:

Feedback Type: ${feedbackData.feedback_type}
Time Period: ${feedbackData.time_period}
Employee Context: ${JSON.stringify(feedbackData.employee_context)}

Feedback Content:
${feedbackData.feedback_text.map((text, i) => `Feedback ${i + 1}: ${text}`).join('\n')}

Perform sentiment analysis and provide:
1. Overall sentiment score
2. Key themes and frequencies
3. Actionable insights
4. Bias detection indicators
5. Specific improvement suggestions

Consider Malaysian communication styles and cultural feedback norms.
`;
        const analysis = await this.generateStructuredResponse(prompt, FeedbackAnalysisSchema);
        if (!analysis) {
            return this.createResponse(false, null, 'Failed to analyze feedback');
        }
        return this.createResponse(true, analysis, 'Feedback analysis completed', [
            'Sentiment analysis performed',
            'Cultural context considered'
        ]);
    }
    async assessNineBox(employeeData) {
        const prompt = `
Perform 9-box grid assessment for talent management:

Employee: ${employeeData.employee_id}
Current Position: ${employeeData.current_position}
Tenure: ${employeeData.tenure_years} years
Recent Achievements: ${employeeData.recent_achievements.join('; ')}

Performance Metrics: ${JSON.stringify(employeeData.performance_metrics)}
Potential Indicators: ${JSON.stringify(employeeData.potential_indicators)}

Assess position in 9-box grid and provide:
1. Performance and potential levels
2. Quadrant placement
3. Development recommendations
4. Career path suggestions
5. Risk assessment and timeline

Consider Malaysian GLC transformation initiatives and NKEA KPIs.
`;
        const assessment = await this.generateStructuredResponse(prompt, NineBoxAnalysisSchema);
        if (!assessment) {
            return this.createResponse(false, null, 'Failed to assess 9-box position');
        }
        return this.createResponse(true, assessment, '9-box assessment completed', [
            'Talent management framework applied',
            'GLC standards considered'
        ]);
    }
    async simulateCareerPath(careerData) {
        const prompt = `
Simulate career path development:

Current Role: ${careerData.current_role}
Career Goals: ${careerData.career_goals.join(', ')}
Time Horizon: ${careerData.time_horizon}
Development Budget: ${careerData.development_budget ? `RM ${careerData.development_budget}` : 'Not specified'}

Current Skills: ${careerData.skills_current.join(', ')}
Required Skills: ${careerData.skills_needed.join(', ')}

Create career simulation including:
1. Potential career trajectories
2. Skill development roadmap
3. Timeline and milestones
4. Required experiences and projects
5. Success probability assessment
6. Alternative paths consideration

Consider Malaysian career progression norms and industry standards.
`;
        const simulation = await this.generateResponse(prompt);
        return this.createResponse(true, { simulation }, 'Career path simulation completed', [
            'Multiple scenarios considered',
            'Malaysian career norms applied'
        ]);
    }
    async detectBias(performanceData) {
        const prompt = `
Detect potential bias in performance evaluations:

Evaluation Data:
${performanceData.evaluations.map(e => `
Evaluator: ${e.evaluator}
Evaluatee: ${e.evaluatee}
Rating: ${e.rating}/5
Comments: ${e.comments}
Relationship: ${e.relationship}
`).join('\n')}

Demographic Data: ${JSON.stringify(performanceData.demographic_data)}

Analyze for bias indicators including:
1. Gender bias patterns
2. Ethnic bias indicators
3. Relationship bias detection
4. Halo/horn effect identification
5. Central tendency bias
6. Recency bias assessment
7. Recommendations for bias mitigation

Ensure PDPA compliance and DEI principles.
`;
        const biasAnalysis = await this.generateResponse(prompt);
        return this.createResponse(true, { biasAnalysis }, 'Bias detection completed', [
            'DEI principles applied',
            'PDPA compliance maintained'
        ]);
    }
}
exports.PerformanceManagementAgent = PerformanceManagementAgent;
//# sourceMappingURL=performance-management-agent.js.map