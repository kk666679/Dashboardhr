"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRAnalyticsAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const AttritionRiskSchema = zod_1.z.object({
    risk_score: zod_1.z.number().min(0).max(100),
    risk_factors: zod_1.z.array(zod_1.z.object({
        factor: zod_1.z.string(),
        weight: zod_1.z.number().min(0).max(1),
        impact: zod_1.z.enum(['low', 'medium', 'high']),
    })),
    predicted_timeline: zod_1.z.string(),
    intervention_strategies: zod_1.z.array(zod_1.z.string()),
    retention_recommendations: zod_1.z.array(zod_1.z.string()),
});
const WorkforcePlanningSchema = zod_1.z.object({
    current_headcount: zod_1.z.number(),
    projected_needs: zod_1.z.object({
        short_term: zod_1.z.number(),
        medium_term: zod_1.z.number(),
        long_term: zod_1.z.number(),
    }),
    skill_gap_analysis: zod_1.z.array(zod_1.z.object({
        skill: zod_1.z.string(),
        current_supply: zod_1.z.number(),
        required_demand: zod_1.z.number(),
        gap_percentage: zod_1.z.number(),
    })),
    hiring_recommendations: zod_1.z.array(zod_1.z.string()),
    training_priorities: zod_1.z.array(zod_1.z.string()),
});
const ComplianceHealthSchema = zod_1.z.object({
    overall_score: zod_1.z.number().min(0).max(100),
    compliance_areas: zod_1.z.array(zod_1.z.object({
        area: zod_1.z.string(),
        compliance_level: zod_1.z.number().min(0).max(100),
        risk_level: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
        last_audit: zod_1.z.string(),
        next_review: zod_1.z.string(),
    })),
    critical_issues: zod_1.z.array(zod_1.z.string()),
    recommended_actions: zod_1.z.array(zod_1.z.string()),
    regulatory_updates: zod_1.z.array(zod_1.z.string()),
});
class HRAnalyticsAgent extends base_agent_1.BaseAgent {
    async execute(input) {
        const { action, data } = input;
        switch (action) {
            case 'predict_attrition_risk':
                return await this.predictAttritionRisk(data);
            case 'plan_workforce':
                return await this.planWorkforce(data);
            case 'assess_compliance_health':
                return await this.assessComplianceHealth(data);
            case 'analyze_culture_metrics':
                return await this.analyzeCultureMetrics(data);
            case 'calculate_hr_roi':
                return await this.calculateHRROI(data);
            default:
                return this.createResponse(false, null, 'Unknown action for HR Analytics Agent');
        }
    }
    async predictAttritionRisk(employeeData) {
        const prompt = `
Predict attrition risk for this employee using advanced analytics:

Employee: ${employeeData.employee_id}
Tenure: ${employeeData.tenure_months} months
Performance Score: ${employeeData.performance_score}/100
Engagement Score: ${employeeData.engagement_score}/100
Compensation Satisfaction: ${employeeData.compensation_satisfaction}/100
Recent Events: ${employeeData.recent_events.join('; ')}
Peer Comparison: ${JSON.stringify(employeeData.peer_comparison)}

Analyze risk factors and provide:
1. Overall risk score (0-100)
2. Key risk factors with weights
3. Predicted timeline for potential departure
4. Intervention strategies
5. Retention recommendations

Consider Malaysian labor market conditions and cultural factors.
`;
        const prediction = await this.generateStructuredResponse(prompt, AttritionRiskSchema);
        if (!prediction) {
            return this.createResponse(false, null, 'Failed to predict attrition risk');
        }
        return this.createResponse(true, prediction, 'Attrition risk prediction completed', [
            'Advanced analytics applied',
            'Malaysian market factors considered'
        ]);
    }
    async planWorkforce(planningData) {
        const prompt = `
Create workforce planning simulation:

Department: ${planningData.department}
Current Headcount: ${planningData.current_headcount}
Budget: RM ${planningData.budget_constraints}
Business Goals: ${planningData.business_goals.join(', ')}
Market Trends: ${JSON.stringify(planningData.market_trends)}
Skill Requirements: ${JSON.stringify(planningData.skill_requirements)}

Generate workforce planning including:
1. Current vs projected headcount needs
2. Skill gap analysis
3. Hiring recommendations with timeline
4. Training and development priorities
5. Cost projections and ROI analysis

Consider Malaysian economic indicators and industry growth projections.
`;
        const planning = await this.generateStructuredResponse(prompt, WorkforcePlanningSchema);
        if (!planning) {
            return this.createResponse(false, null, 'Failed to plan workforce');
        }
        return this.createResponse(true, planning, 'Workforce planning completed', [
            'Economic forecasting applied',
            'Skill market analysis included'
        ]);
    }
    async assessComplianceHealth(complianceData) {
        const prompt = `
Assess organizational compliance health across Malaysian regulations:

Organization Size: ${complianceData.organization_size} employees
Industry: ${complianceData.industry}
Recent Audits: ${JSON.stringify(complianceData.recent_audits)}
Regulatory Changes: ${complianceData.regulatory_changes.join('; ')}
Compliance Areas: ${complianceData.compliance_areas.join(', ')}

Evaluate compliance health including:
1. Overall compliance score
2. Area-specific compliance levels
3. Risk assessments for each area
4. Critical issues requiring attention
5. Recommended actions and timelines
6. Upcoming regulatory requirements

Focus on Employment Act 1955, PDPA 2010, EPF Act 1991, SOCSO Act 1969.
`;
        const assessment = await this.generateStructuredResponse(prompt, ComplianceHealthSchema);
        if (!assessment) {
            return this.createResponse(false, null, 'Failed to assess compliance health');
        }
        return this.createResponse(true, assessment, 'Compliance health assessment completed', [
            'Malaysian regulatory framework applied',
            'Risk-based assessment performed'
        ]);
    }
    async analyzeCultureMetrics(cultureData) {
        const prompt = `
Analyze organizational culture metrics and sentiment:

Time Period: ${cultureData.time_period}
Comparison Period: ${cultureData.comparison_period || 'N/A'}
Survey Responses: ${cultureData.survey_responses.length} responses
Engagement Scores: ${cultureData.engagement_scores.join(', ')}
Feedback Themes: ${cultureData.feedback_themes.join('; ')}

Perform culture analysis including:
1. Overall culture health score
2. Key themes and sentiment patterns
3. Engagement trends over time
4. DEI metrics assessment
5. Actionable insights for improvement
6. Cultural health indicators

Consider Malaysian workplace culture and Bumiputera development aspects.
`;
        const analysis = await this.generateResponse(prompt);
        return this.createResponse(true, { analysis }, 'Culture metrics analysis completed', [
            'Sentiment analysis performed',
            'DEI metrics calculated'
        ]);
    }
    async calculateHRROI(roiData) {
        const prompt = `
Calculate ROI for HR investments and initiatives:

Time Period: ${roiData.time_period}
Measurement Period: ${roiData.measurement_period}

HR Investments:
${roiData.hr_investments.map(inv => `- ${inv.category}: RM ${inv.amount} (${inv.description})`).join('\n')}

Business Outcomes:
${roiData.business_outcomes.map(out => `- ${out.metric}: ${out.value} (${out.impact})`).join('\n')}

Calculate comprehensive ROI including:
1. Cost-benefit analysis for each investment
2. Productivity impact assessment
3. Retention and engagement ROI
4. Training and development returns
5. Compliance cost savings
6. Overall HR function ROI

Consider Malaysian HR metrics and Bursa Malaysia ESG reporting requirements.
`;
        const roi = await this.generateResponse(prompt);
        return this.createResponse(true, { roi }, 'HR ROI calculation completed', [
            'Financial analysis performed',
            'ESG reporting aligned'
        ]);
    }
}
exports.HRAnalyticsAgent = HRAnalyticsAgent;
//# sourceMappingURL=hr-analytics-agent.js.map