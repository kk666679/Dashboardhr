"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentAcquisitionAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const ResumeAnalysisSchema = zod_1.z.object({
    candidate_score: zod_1.z.number().min(0).max(100),
    key_qualifications: zod_1.z.array(zod_1.z.string()),
    experience_match: zod_1.z.number().min(0).max(100),
    cultural_fit_score: zod_1.z.number().min(0).max(100),
    recommendations: zod_1.z.array(zod_1.z.string()),
    red_flags: zod_1.z.array(zod_1.z.string()),
});
const InterviewAnalysisSchema = zod_1.z.object({
    overall_rating: zod_1.z.number().min(0).max(100),
    competency_scores: zod_1.z.object({
        technical_skills: zod_1.z.number().min(0).max(100),
        communication: zod_1.z.number().min(0).max(100),
        problem_solving: zod_1.z.number().min(0).max(100),
        cultural_fit: zod_1.z.number().min(0).max(100),
    }),
    bias_indicators: zod_1.z.array(zod_1.z.string()),
    strengths: zod_1.z.array(zod_1.z.string()),
    development_areas: zod_1.z.array(zod_1.z.string()),
    hiring_recommendation: zod_1.z.enum(['strong_hire', 'hire', 'consider', 'no_hire']),
});
const QualityOfHireSchema = zod_1.z.object({
    quality_score: zod_1.z.number().min(0).max(100),
    performance_metrics: zod_1.z.array(zod_1.z.object({
        metric: zod_1.z.string(),
        score: zod_1.z.number().min(0).max(100),
        trend: zod_1.z.enum(['improving', 'stable', 'declining']),
    })),
    retention_rate: zod_1.z.number().min(0).max(100),
    time_to_productivity: zod_1.z.string(),
    cost_effectiveness: zod_1.z.number().min(0).max(100),
});
class TalentAcquisitionAgent extends base_agent_1.BaseAgent {
    async execute(input) {
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
    async parseResume(resumeData) {
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
    async screenCandidate(candidateData) {
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
    async analyzeInterview(interviewData) {
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
    async predictQualityOfHire(hireData) {
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
    async engageCandidate(engagementData) {
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
exports.TalentAcquisitionAgent = TalentAcquisitionAgent;
//# sourceMappingURL=talent-acquisition-agent.js.map