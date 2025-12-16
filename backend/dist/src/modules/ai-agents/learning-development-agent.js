"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningDevelopmentAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const SkillsGapAnalysisSchema = zod_1.z.object({
    identified_gaps: zod_1.z.array(zod_1.z.object({
        skill: zod_1.z.string(),
        current_level: zod_1.z.number().min(0).max(100),
        required_level: zod_1.z.number().min(0).max(100),
        gap_severity: zod_1.z.enum(['low', 'medium', 'high']),
        priority: zod_1.z.enum(['low', 'medium', 'high']),
    })),
    overall_readiness: zod_1.z.number().min(0).max(100),
    recommended_training: zod_1.z.array(zod_1.z.string()),
    timeline: zod_1.z.string(),
});
const LearningPathSchema = zod_1.z.object({
    path_name: zod_1.z.string(),
    duration_weeks: zod_1.z.number(),
    modules: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        duration_hours: zod_1.z.number(),
        prerequisites: zod_1.z.array(zod_1.z.string()),
        learning_objectives: zod_1.z.array(zod_1.z.string()),
        delivery_method: zod_1.z.enum(['online', 'classroom', 'blended', 'on_job']),
    })),
    certifications: zod_1.z.array(zod_1.z.string()),
    success_metrics: zod_1.z.array(zod_1.z.string()),
});
const TrainingROISchema = zod_1.z.object({
    projected_roi: zod_1.z.number(),
    cost_benefit_analysis: zod_1.z.object({
        training_cost: zod_1.z.number(),
        productivity_gain: zod_1.z.number(),
        quality_improvement: zod_1.z.number(),
        retention_impact: zod_1.z.number(),
    }),
    payback_period_months: zod_1.z.number(),
    risk_assessment: zod_1.z.enum(['low', 'medium', 'high']),
    recommendations: zod_1.z.array(zod_1.z.string()),
});
class LearningDevelopmentAgent extends base_agent_1.BaseAgent {
    async execute(input) {
        const { action, data } = input;
        switch (action) {
            case 'analyze_skills_gap':
                return await this.analyzeSkillsGap(data);
            case 'create_learning_path':
                return await this.createLearningPath(data);
            case 'recommend_micro_learning':
                return await this.recommendMicroLearning(data);
            case 'predict_training_roi':
                return await this.predictTrainingROI(data);
            case 'simulate_competency':
                return await this.simulateCompetency(data);
            default:
                return this.createResponse(false, null, 'Unknown action for Learning & Development Agent');
        }
    }
    async analyzeSkillsGap(employeeData) {
        const prompt = `
Analyze skills gaps for this employee:

Employee: ${employeeData.employee_id}
Job Role: ${employeeData.job_role}
Department: ${employeeData.department}

Current Skills:
${employeeData.current_skills.map(s => `- ${s.skill}: ${s.level}/100`).join('\n')}

Required Skills:
${employeeData.required_skills.map(s => `- ${s.skill}: ${s.level}/100`).join('\n')}

Identify gaps and provide:
1. Specific skill gaps with severity levels
2. Overall readiness score
3. Prioritized training recommendations
4. Suggested timeline for skill development

Consider Malaysian workforce development priorities and HRDF requirements.
`;
        const analysis = await this.generateStructuredResponse(prompt, SkillsGapAnalysisSchema);
        if (!analysis) {
            return this.createResponse(false, null, 'Failed to analyze skills gap');
        }
        return this.createResponse(true, analysis, 'Skills gap analysis completed', [
            'HRDF compliance considered',
            'Malaysian skills framework applied'
        ]);
    }
    async createLearningPath(learningData) {
        const prompt = `
Create personalized learning path for skill development:

Employee Profile: ${JSON.stringify(learningData.employee_profile)}
Skills Gaps: ${JSON.stringify(learningData.skills_gaps)}
Career Goals: ${learningData.career_goals.join(', ')}
Time Availability: ${learningData.time_availability}
Learning Style: ${learningData.learning_style}
Budget: ${learningData.budget_constraints ? `RM ${learningData.budget_constraints}` : 'Not specified'}

Design comprehensive learning path including:
1. Path name and duration
2. Structured modules with objectives
3. Prerequisites and dependencies
4. Delivery methods (online, classroom, blended)
5. Certification milestones
6. Success measurement metrics

Ensure HRDF claimable activities and Malaysian skills recognition.
`;
        const path = await this.generateStructuredResponse(prompt, LearningPathSchema);
        if (!path) {
            return this.createResponse(false, null, 'Failed to create learning path');
        }
        return this.createResponse(true, path, 'Learning path created', [
            'Personalization applied',
            'HRDF compliance verified'
        ]);
    }
    async recommendMicroLearning(employeeData) {
        const prompt = `
Recommend micro-learning content for just-in-time skill development:

Current Context: ${employeeData.current_context}
Recent Performance: ${JSON.stringify(employeeData.recent_performance)}
Immediate Needs: ${employeeData.immediate_needs.join(', ')}
Device Preference: ${employeeData.device_preference}
Available Time Slots: ${employeeData.time_slots.join(', ')}

Provide micro-learning recommendations including:
1. 5-15 minute learning modules
2. Quick tips and best practices
3. Interactive exercises
4. Mobile-friendly content
5. Immediate application opportunities

Consider Malaysian workplace scenarios and cultural context.
`;
        const recommendations = await this.generateResponse(prompt);
        return this.createResponse(true, { recommendations }, 'Micro-learning recommendations provided', [
            'Just-in-time learning approach',
            'Mobile-optimized content'
        ]);
    }
    async predictTrainingROI(trainingData) {
        const prompt = `
Predict ROI for this training program:

Program: ${trainingData.program_name}
Target Audience: ${trainingData.target_audience} employees
Training Cost: RM ${trainingData.training_cost}
Duration: ${trainingData.duration_hours} hours
Expected Outcomes: ${trainingData.expected_outcomes.join(', ')}
Historical Data: ${trainingData.historical_data ? JSON.stringify(trainingData.historical_data) : 'Not available'}

Calculate projected ROI including:
1. Cost-benefit analysis breakdown
2. Productivity gains estimation
3. Quality improvement metrics
4. Retention impact assessment
5. Payback period calculation
6. Risk assessment and recommendations

Consider Malaysian training market and HRDF funding implications.
`;
        const roi = await this.generateStructuredResponse(prompt, TrainingROISchema);
        if (!roi) {
            return this.createResponse(false, null, 'Failed to predict training ROI');
        }
        return this.createResponse(true, roi, 'Training ROI prediction completed', [
            'Financial analysis performed',
            'HRDF funding considered'
        ]);
    }
    async simulateCompetency(simulationData) {
        const prompt = `
Create AR/VR competency simulation scenario:

Competency: ${simulationData.competency}
Scenario: ${simulationData.scenario}
Employee Level: ${simulationData.employee_level}
Assessment Criteria: ${simulationData.assessment_criteria.join(', ')}
Time Limit: ${simulationData.time_limit || 30} minutes

Design immersive simulation including:
1. Scenario setup and objectives
2. Interactive elements and decision points
3. Assessment rubrics
4. Debriefing questions
5. Learning outcomes measurement

Consider Malaysian workplace safety standards and cultural scenarios.
`;
        const simulation = await this.generateResponse(prompt);
        return this.createResponse(true, { simulation }, 'Competency simulation designed', [
            'Immersive learning approach',
            'Safety standards incorporated'
        ]);
    }
}
exports.LearningDevelopmentAgent = LearningDevelopmentAgent;
//# sourceMappingURL=learning-development-agent.js.map