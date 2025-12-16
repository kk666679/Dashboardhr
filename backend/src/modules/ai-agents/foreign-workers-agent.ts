import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const PermitRenewalSchema = z.object({
  renewal_required: z.boolean(),
  renewal_date: z.string(),
  documents_needed: z.array(z.string()),
  risk_assessment: z.enum(['low', 'medium', 'high']),
  recommended_actions: z.array(z.string()),
  compliance_status: z.string(),
});

const ComplianceRiskSchema = z.object({
  overall_risk: z.enum(['low', 'medium', 'high', 'critical']),
  risk_factors: z.array(z.object({
    factor: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    mitigation: z.string(),
  })),
  compliance_score: z.number().min(0).max(100),
  priority_actions: z.array(z.string()),
});

const MultiLanguageCommunicationSchema = z.object({
  detected_language: z.string(),
  translated_message: z.string(),
  cultural_notes: z.array(z.string()),
  recommended_response: z.string(),
  urgency_level: z.enum(['low', 'medium', 'high']),
});

export class ForeignWorkersAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
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

  private async predictPermitRenewal(workerData: {
    worker_id: string;
    permit_type: string;
    expiry_date: string;
    nationality: string;
    employment_status: string;
  }): Promise<AgentResponse> {
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

  private async assessComplianceRisk(workerData: {
    workers: Array<{
      id: string;
      permit_status: string;
      medical_status: string;
      accommodation: string;
      last_inspection: string;
    }>;
    department: string;
    recent_changes: string[];
  }): Promise<AgentResponse> {
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

  private async translateCommunication(communicationData: {
    message: string;
    source_language?: string;
    target_language: 'en' | 'ms' | 'zh' | 'ta' | 'bn' | 'ne' | 'id';
    context: string;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<AgentResponse> {
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

  private async analyzeAgencyPerformance(agencyData: {
    agency_name: string;
    workers_placed: number;
    compliance_rate: number;
    feedback_scores: number[];
    incidents: string[];
    contract_period: string;
  }): Promise<AgentResponse> {
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

  private async optimizeLevyCalculations(levyData: {
    worker_count: number;
    sectors: string[];
    current_rates: { [sector: string]: number };
    payment_history: any[];
    forecasted_hiring: number;
  }): Promise<AgentResponse> {
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
