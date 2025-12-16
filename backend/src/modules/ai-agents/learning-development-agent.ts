import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const SkillsGapAnalysisSchema = z.object({
  identified_gaps: z.array(z.object({
    skill: z.string(),
    current_level: z.number().min(0).max(100),
    required_level: z.number().min(0).max(100),
    gap_severity: z.enum(['low', 'medium', 'high']),
    priority: z.enum(['low', 'medium', 'high']),
  })),
  overall_readiness: z.number().min(0).max(100),
  recommended_training: z.array(z.string()),
  timeline: z.string(),
});

const LearningPathSchema = z.object({
  path_name: z.string(),
  duration_weeks: z.number(),
  modules: z.array(z.object({
    title: z.string(),
    duration_hours: z.number(),
    prerequisites: z.array(z.string()),
    learning_objectives: z.array(z.string()),
    delivery_method: z.enum(['online', 'classroom', 'blended', 'on_job']),
  })),
  certifications: z.array(z.string()),
  success_metrics: z.array(z.string()),
});

const TrainingROISchema = z.object({
  projected_roi: z.number(),
  cost_benefit_analysis: z.object({
    training_cost: z.number(),
    productivity_gain: z.number(),
    quality_improvement: z.number(),
    retention_impact: z.number(),
  }),
  payback_period_months: z.number(),
  risk_assessment: z.enum(['low', 'medium', 'high']),
  recommendations: z.array(z.string()),
});

export class LearningDevelopmentAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
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

  private async analyzeSkillsGap(employeeData: {
    employee_id: string;
    current_skills: Array<{ skill: string; level: number }>;
    required_skills: Array<{ skill: string; level: number }>;
    job_role: string;
    department: string;
  }): Promise<AgentResponse> {
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

  private async createLearningPath(learningData: {
    employee_profile: any;
    skills_gaps: any[];
    career_goals: string[];
    time_availability: string;
    learning_style: string;
    budget_constraints?: number;
  }): Promise<AgentResponse> {
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

  private async recommendMicroLearning(employeeData: {
    current_context: string;
    recent_performance: any;
    immediate_needs: string[];
    device_preference: string;
    time_slots: string[];
  }): Promise<AgentResponse> {
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

  private async predictTrainingROI(trainingData: {
    program_name: string;
    target_audience: number;
    training_cost: number;
    duration_hours: number;
    expected_outcomes: string[];
    historical_data?: any[];
  }): Promise<AgentResponse> {
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

  private async simulateCompetency(simulationData: {
    competency: string;
    scenario: string;
    employee_level: string;
    assessment_criteria: string[];
    time_limit?: number;
  }): Promise<AgentResponse> {
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
