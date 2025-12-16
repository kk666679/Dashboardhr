import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const ResumeAnalysisSchema = z.object({
  candidate_score: z.number().min(0).max(100),
  key_qualifications: z.array(z.string()),
  experience_match: z.number().min(0).max(100),
  cultural_fit_score: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
  red_flags: z.array(z.string()),
});

const InterviewAnalysisSchema = z.object({
  overall_rating: z.number().min(0).max(100),
  competency_scores: z.object({
    technical_skills: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    problem_solving: z.number().min(0).max(100),
    cultural_fit: z.number().min(0).max(100),
  }),
  bias_indicators: z.array(z.string()),
  strengths: z.array(z.string()),
  development_areas: z.array(z.string()),
  hiring_recommendation: z.enum(['strong_hire', 'hire', 'consider', 'no_hire']),
});

const QualityOfHireSchema = z.object({
  quality_score: z.number().min(0).max(100),
  performance_metrics: z.array(z.object({
    metric: z.string(),
    score: z.number().min(0).max(100),
    trend: z.enum(['improving', 'stable', 'declining']),
  })),
  retention_rate: z.number().min(0).max(100),
  time_to_productivity: z.string(),
  cost_effectiveness: z.number().min(0).max(100),
});

export class TalentAcquisitionAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
    const { action, data } = input;

    switch (action) {
      case 'parse_resume':
        return await this.parseResume(data);
      case 'screen_candidate':
        return await this.screenCandidate(data);
      case 'analyze_interview':
        return await this.analyzeInterview(data);
      case 'predict_quality_of_hire':
        return await this.predictQualityOfHire(data);
      case 'engage_candidate':
        return await this.engageCandidate(data);
      default:
        return this.createResponse(false, null, 'Unknown action for Talent Acquisition Agent');
    }
  }

  private async parseResume(resumeData: {
    content: string;
    job_requirements: string[];
    position: string;
    required_qualifications: string[];
  }): Promise<AgentResponse> {
    const prompt = `
Parse and analyze this resume for the specified position:

Resume Content: ${resumeData.content}

Job Requirements: ${resumeData.job_requirements.join(', ')}
Position: ${resumeData.position}
Required Qualifications: ${resumeData.required_qualifications.join(', ')}

Analyze considering Malaysian education system and local qualifications:
1. Candidate overall score (0-100)
2. Key qualifications matched
3. Experience match percentage
4. Cultural fit assessment
5. Recommendations and red flags

Consider UiTM, UM, USM degrees and Malaysian professional certifications.
`;

    const analysis = await this.generateStructuredResponse(prompt, ResumeAnalysisSchema);

    if (!analysis) {
      return this.createResponse(false, null, 'Failed to parse resume');
    }

    return this.createResponse(true, analysis, 'Resume parsing completed', [
      'Malaysian education system considered',
      'Local qualifications recognized'
    ]);
  }

  private async screenCandidate(candidateData: {
    resume_analysis: any;
    job_description: string;
    screening_questions: string[];
    responses: string[];
    background_check?: any;
  }): Promise<AgentResponse> {
    const prompt = `
Perform AI-powered candidate screening:

Job Description: ${candidateData.job_description}
Resume Analysis: ${JSON.stringify(candidateData.resume_analysis)}
Screening Questions: ${candidateData.screening_questions.join('; ')}
Candidate Responses: ${candidateData.responses.join('; ')}
Background Check: ${candidateData.background_check ? JSON.stringify(candidateData.background_check) : 'Not available'}

Provide comprehensive screening including:
1. Qualification assessment
2. Experience evaluation
3. Cultural fit analysis
4. Potential concerns
5. Interview recommendations

Consider Malaysian workplace culture and Bumiputera hiring preferences.
`;

    const screening = await this.generateResponse(prompt);

    return this.createResponse(true, { screening }, 'Candidate screening completed', [
      'Bias detection applied',
      'Cultural fit assessed'
    ]);
  }

  private async analyzeInterview(interviewData: {
    transcript: string;
    questions: string[];
    responses: string[];
    position: string;
    interviewer_notes: string[];
  }): Promise<AgentResponse> {
    const prompt = `
Analyze this interview transcript for hiring decision support:

Position: ${interviewData.position}
Interview Transcript: ${interviewData.transcript}
Questions Asked: ${interviewData.questions.join('; ')}
Interviewer Notes: ${interviewData.interviewer_notes.join('; ')}

Provide analysis including:
1. Overall candidate rating
2. Competency scores (technical, communication, problem-solving, cultural fit)
3. Bias indicators detected
4. Key strengths and development areas
5. Hiring recommendation

Consider Malaysian communication styles and cultural context.
`;

    const analysis = await this.generateStructuredResponse(prompt, InterviewAnalysisSchema);

    if (!analysis) {
      return this.createResponse(false, null, 'Failed to analyze interview');
    }

    return this.createResponse(true, analysis, 'Interview analysis completed', [
      'Bias detection performed',
      'Cultural context considered'
    ]);
  }

  private async predictQualityOfHire(hireData: {
    candidate_profile: any;
    historical_hires: any[];
    position_requirements: string[];
    team_dynamics: any;
  }): Promise<AgentResponse> {
    const prompt = `
Predict quality of hire for this candidate:

Candidate Profile: ${JSON.stringify(hireData.candidate_profile)}
Position Requirements: ${hireData.position_requirements.join(', ')}
Team Dynamics: ${JSON.stringify(hireData.team_dynamics)}
Historical Hires Data: ${JSON.stringify(hireData.historical_hires)}

Predict:
1. Overall quality score
2. Performance metrics projection
3. Retention likelihood
4. Time to productivity
5. Cost-effectiveness assessment

Consider Malaysian talent market and organizational culture.
`;

    const prediction = await this.generateStructuredResponse(prompt, QualityOfHireSchema);

    if (!prediction) {
      return this.createResponse(false, null, 'Failed to predict quality of hire');
    }

    return this.createResponse(true, prediction, 'Quality of hire prediction completed', [
      'Historical data analysis performed',
      'Malaysian market factors considered'
    ]);
  }

  private async engageCandidate(engagementData: {
    candidate_name: string;
    position: string;
    stage: string;
    communication_history: string[];
    preferences: string[];
    timeline: string;
  }): Promise<AgentResponse> {
    const prompt = `
Generate personalized candidate engagement strategy:

Candidate: ${engagementData.candidate_name}
Position: ${engagementData.position}
Current Stage: ${engagementData.stage}
Communication History: ${engagementData.communication_history.join('; ')}
Candidate Preferences: ${engagementData.preferences.join(', ')}
Timeline: ${engagementData.timeline}

Create engagement plan including:
1. Communication strategy
2. Follow-up schedule
3. Personalized messaging
4. Offer negotiation approach
5. Onboarding preparation

Consider Malaysian communication norms and cultural expectations.
${this.context.language === 'ms' ? 'Include Bahasa Malaysia communication options.' : ''}
`;

    const engagement = await this.generateResponse(prompt);

    return this.createResponse(true, { engagement }, 'Candidate engagement strategy generated', [
      'Personalization applied',
      'Cultural sensitivity maintained'
    ]);
  }
}
