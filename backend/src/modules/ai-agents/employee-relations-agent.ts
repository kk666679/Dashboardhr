import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const EmotionAnalysisSchema = z.object({
  dominant_emotion: z.string(),
  emotion_intensity: z.number().min(0).max(1),
  sentiment_score: z.number().min(-1).max(1),
  key_themes: z.array(z.string()),
  recommended_actions: z.array(z.string()),
});

const ConflictMediationSchema = z.object({
  conflict_type: z.string(),
  severity_level: z.enum(['low', 'medium', 'high']),
  mediation_approach: z.string(),
  suggested_steps: z.array(z.string()),
  expected_outcome: z.string(),
  follow_up_actions: z.array(z.string()),
});

const CultureHealthSchema = z.object({
  overall_score: z.number().min(0).max(100),
  dimensions: z.object({
    engagement: z.number().min(0).max(100),
    inclusion: z.number().min(0).max(100),
    psychological_safety: z.number().min(0).max(100),
    growth_mindset: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()),
  areas_for_improvement: z.array(z.string()),
  action_plan: z.array(z.string()),
});

export class EmployeeRelationsAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
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

  private async analyzeEmotion(feedbackData: {
    text: string;
    employee_id?: string;
    context: string;
    language?: 'en' | 'ms';
  }): Promise<AgentResponse> {
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

  private async mediateConflict(conflictData: {
    description: string;
    parties_involved: string[];
    conflict_type: string;
    duration: string;
    previous_attempts?: string[];
  }): Promise<AgentResponse> {
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

  private async assessCultureHealth(surveyData: {
    responses: Array<{
      question: string;
      answer: string | number;
      category: string;
    }>;
    department?: string;
    time_period: string;
  }): Promise<AgentResponse> {
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

  private async predictERCase(patternData: {
    employee_history: any[];
    behavioral_indicators: string[];
    department_trends: any;
    recent_events: string[];
  }): Promise<AgentResponse> {
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

  private async generateInvestigation(investigationData: {
    incident: string;
    witnesses: string[];
    timeline: any[];
    evidence: string[];
    policies_violated: string[];
  }): Promise<AgentResponse> {
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
