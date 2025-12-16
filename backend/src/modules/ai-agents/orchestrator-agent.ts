import { BaseAgent, AgentResponse, AgentContext } from './base-agent';
import { IndustrialRelationsAgent } from './industrial-relations-agent';
import { EmployeeRelationsAgent } from './employee-relations-agent';
import { ForeignWorkersAgent } from './foreign-workers-agent';
import { CompensationBenefitsAgent } from './compensation-benefits-agent';
import { TalentAcquisitionAgent } from './talent-acquisition-agent';
import { LearningDevelopmentAgent } from './learning-development-agent';
import { PerformanceManagementAgent } from './performance-management-agent';
import { HRAnalyticsAgent } from './hr-analytics-agent';
import { z } from 'zod';

const OrchestrationPlanSchema = z.object({
  primary_agent: z.string(),
  supporting_agents: z.array(z.string()),
  execution_order: z.array(z.string()),
  dependencies: z.array(z.object({
    task: z.string(),
    depends_on: z.array(z.string()),
  })),
  estimated_duration: z.string(),
  risk_assessment: z.string(),
});

const MultiAgentResponseSchema = z.object({
  coordinated_response: z.string(),
  agent_contributions: z.array(z.object({
    agent: z.string(),
    contribution: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  integrated_insights: z.array(z.string()),
  next_steps: z.array(z.string()),
  compliance_summary: z.array(z.string()),
});

interface MultiAgentResponse {
  coordinated_response: string;
  agent_contributions: Array<{
    agent: string;
    contribution: string;
    confidence: number;
  }>;
  integrated_insights: string[];
  next_steps: string[];
  compliance_summary: string[];
}

export class OrchestratorAgent extends BaseAgent {
  private agents: Map<string, BaseAgent>;

  constructor(context: AgentContext = {}) {
    super(context);
    this.initializeAgents();
  }

  private initializeAgents() {
    this.agents = new Map<string, BaseAgent>([
      ['industrial-relations', new IndustrialRelationsAgent(this.context)],
      ['employee-relations', new EmployeeRelationsAgent(this.context)],
      ['foreign-workers', new ForeignWorkersAgent(this.context)],
      ['compensation-benefits', new CompensationBenefitsAgent(this.context)],
      ['talent-acquisition', new TalentAcquisitionAgent(this.context)],
      ['learning-development', new LearningDevelopmentAgent(this.context)],
      ['performance-management', new PerformanceManagementAgent(this.context)],
      ['hr-analytics', new HRAnalyticsAgent(this.context)],
    ]);
  }

  async execute(input: any): Promise<AgentResponse> {
    const { action, data, multi_agent = false } = input;

    if (multi_agent) {
      return await this.orchestrateMultiAgent(input);
    }

    // Single agent execution
    const targetAgent = this.determineTargetAgent(action, data);
    if (!targetAgent) {
      return this.createResponse(false, null, 'Unable to determine appropriate agent for this task');
    }

    const agent = this.agents.get(targetAgent);
    if (!agent) {
      return this.createResponse(false, null, `Agent ${targetAgent} not found`);
    }

    try {
      const result = await agent.execute(input);
      return this.enhanceResponseWithOrchestration(result, targetAgent);
    } catch (error) {
      console.error(`Agent execution error for ${targetAgent}:`, error);
      return this.createResponse(false, null, `Failed to execute task with ${targetAgent} agent`);
    }
  }

  private async orchestrateMultiAgent(input: any): Promise<AgentResponse> {
    const { action, data } = input;

    // Create orchestration plan
    const plan = await this.createOrchestrationPlan(action, data);
    if (!plan) {
      return this.createResponse(false, null, 'Failed to create orchestration plan');
    }

    // Execute agents in planned order
    const results = new Map<string, AgentResponse>();
    const executedAgents: string[] = [];

    for (const agentName of plan.execution_order) {
      // Check dependencies
      const dependencies = plan.dependencies.find(d => d.task === agentName)?.depends_on || [];
      const unmetDeps = dependencies.filter(dep => !executedAgents.includes(dep));

      if (unmetDeps.length > 0) {
        console.warn(`Skipping ${agentName} due to unmet dependencies: ${unmetDeps.join(', ')}`);
        continue;
      }

      const agent = this.agents.get(agentName);
      if (!agent) continue;

      try {
        const agentInput = this.prepareAgentInput(agentName, data, results);
        const result = await agent.execute(agentInput);
        results.set(agentName, result);
        executedAgents.push(agentName);
      } catch (error) {
        console.error(`Multi-agent execution error for ${agentName}:`, error);
        results.set(agentName, this.createResponse(false, null, `Execution failed: ${error.message}`));
      }
    }

    // Integrate results
    return await this.integrateMultiAgentResults(results, plan);
  }

  private determineTargetAgent(action: string, data: any): string | null {
    const actionMapping: { [key: string]: string } = {
      // Industrial Relations
      'analyze_dispute': 'industrial-relations',
      'assess_strike_risk': 'industrial-relations',
      'review_agreement': 'industrial-relations',

      // Employee Relations
      'analyze_emotion': 'employee-relations',
      'mediate_conflict': 'employee-relations',
      'assess_culture_health': 'employee-relations',

      // Foreign Workers
      'predict_permit_renewal': 'foreign-workers',
      'assess_compliance_risk': 'foreign-workers',
      'translate_communication': 'foreign-workers',

      // Compensation & Benefits
      'benchmark_salary': 'compensation-benefits',
      'personalize_benefits': 'compensation-benefits',
      'analyze_pay_equity': 'compensation-benefits',
      'calculate_zakat': 'compensation-benefits',

      // Talent Acquisition
      'parse_resume': 'talent-acquisition',
      'screen_candidate': 'talent-acquisition',
      'analyze_interview': 'talent-acquisition',

      // Learning & Development
      'analyze_skills_gap': 'learning-development',
      'create_learning_path': 'learning-development',
      'predict_training_roi': 'learning-development',

      // Performance Management
      'track_okr': 'performance-management',
      'analyze_feedback': 'performance-management',
      'assess_nine_box': 'performance-management',

      // HR Analytics
      'predict_attrition_risk': 'hr-analytics',
      'plan_workforce': 'hr-analytics',
      'assess_compliance_health': 'hr-analytics',
    };

    return actionMapping[action] || null;
  }

  private async createOrchestrationPlan(action: string, data: any): Promise<any> {
    const prompt = `
Create an orchestration plan for this complex HR task:

Action: ${action}
Data Context: ${JSON.stringify(data)}

Determine which AI agents should collaborate and in what order. Consider:

Malaysian HR Context:
- Multi-cultural workforce considerations
- Islamic finance and Zakat compliance
- Foreign worker management
- Industrial relations requirements
- PDPA and other regulatory compliance

Available Agents:
- industrial-relations: Dispute analysis, strike risk, agreements
- employee-relations: Emotion analysis, conflict mediation, culture health
- foreign-workers: Permit renewals, compliance, multi-language support
- compensation-benefits: Salary benchmarking, Zakat, pay equity
- talent-acquisition: Resume parsing, candidate screening, interviews
- learning-development: Skills gaps, learning paths, training ROI
- performance-management: OKR tracking, feedback analysis, 9-box
- hr-analytics: Attrition prediction, workforce planning, compliance health

Provide orchestration plan with agent selection, execution order, and dependencies.
`;

    return await this.generateStructuredResponse(prompt, OrchestrationPlanSchema);
  }

  private prepareAgentInput(agentName: string, originalData: any, previousResults: Map<string, AgentResponse>): any {
    // Enhance input with context from previous agent results
    const enhancedData = { ...originalData };

    // Add relevant context from previous executions
    for (const [prevAgent, result] of Array.from(previousResults.entries())) {
      if (result.success && result.data) {
        enhancedData[`${prevAgent}_context`] = result.data;
      }
    }

    return {
      action: originalData.action,
      data: enhancedData,
    };
  }

  private async integrateMultiAgentResults(
    results: Map<string, AgentResponse>,
    plan: any
  ): Promise<AgentResponse> {
    const successfulResults = Array.from(results.entries())
      .filter(([_, result]) => result.success);

    if (successfulResults.length === 0) {
      return this.createResponse(false, null, 'All agent executions failed');
    }

    const prompt = `
Integrate results from multiple AI agents for comprehensive HR insights:

Orchestration Plan: ${JSON.stringify(plan)}
Agent Results:
${successfulResults.map(([agent, result]) => `
${agent.toUpperCase()} AGENT:
Success: ${result.success}
Data: ${JSON.stringify(result.data)}
Message: ${result.message}
Compliance Notes: ${result.compliance_notes?.join(', ') || 'None'}
Confidence: ${result.confidence_score || 'N/A'}
`).join('\n')}

Provide integrated analysis that:
1. Synthesizes insights from all agents
2. Identifies complementary findings
3. Resolves any conflicting recommendations
4. Provides comprehensive action plan
5. Ensures regulatory compliance across all areas
6. Considers Malaysian HR context and cultural factors

Format as coordinated response with clear next steps.
`;

    const integration = await this.generateStructuredResponse(prompt, MultiAgentResponseSchema);

    if (!integration) {
      // Fallback: combine results manually
      const combinedData = Object.fromEntries(
        successfulResults.map(([agent, result]) => [agent, result.data])
      );

      return this.createResponse(true, combinedData,
        'Multi-agent execution completed with manual integration',
        ['Results integrated manually', 'Review individual agent outputs for details']
      );
    }

    return this.createResponse(true, integration,
      'Multi-agent orchestration completed successfully',
      (integration as MultiAgentResponse).compliance_summary
    );
  }

  private enhanceResponseWithOrchestration(result: AgentResponse, agentName: string): AgentResponse {
    if (!result.success) return result;

    // Add orchestration metadata
    const enhancedResult = {
      ...result,
      orchestration_metadata: {
        primary_agent: agentName,
        coordination_timestamp: new Date().toISOString(),
        malaysian_compliance_verified: this.context.compliance,
        multi_agent_capable: true,
      }
    };

    return enhancedResult;
  }

  // Specialized orchestration methods for common HR scenarios
  async orchestrateEmployeeLifecycle(employeeData: any): Promise<AgentResponse> {
    return await this.orchestrateMultiAgent({
      action: 'employee_lifecycle',
      data: employeeData,
      multi_agent: true,
    });
  }

  async orchestrateComplianceAudit(auditData: any): Promise<AgentResponse> {
    return await this.orchestrateMultiAgent({
      action: 'compliance_audit',
      data: auditData,
      multi_agent: true,
    });
  }

  async orchestrateWorkforcePlanning(planningData: any): Promise<AgentResponse> {
    return await this.orchestrateMultiAgent({
      action: 'workforce_planning',
      data: planningData,
      multi_agent: true,
    });
  }

  async orchestratePerformanceReview(reviewData: any): Promise<AgentResponse> {
    return await this.orchestrateMultiAgent({
      action: 'performance_review',
      data: reviewData,
      multi_agent: true,
    });
  }
}
