"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorAgent = void 0;
const base_agent_1 = require("./base-agent");
const industrial_relations_agent_1 = require("./industrial-relations-agent");
const employee_relations_agent_1 = require("./employee-relations-agent");
const foreign_workers_agent_1 = require("./foreign-workers-agent");
const compensation_benefits_agent_1 = require("./compensation-benefits-agent");
const talent_acquisition_agent_1 = require("./talent-acquisition-agent");
const learning_development_agent_1 = require("./learning-development-agent");
const performance_management_agent_1 = require("./performance-management-agent");
const hr_analytics_agent_1 = require("./hr-analytics-agent");
const zod_1 = require("zod");
const OrchestrationPlanSchema = zod_1.z.object({
    primary_agent: zod_1.z.string(),
    supporting_agents: zod_1.z.array(zod_1.z.string()),
    execution_order: zod_1.z.array(zod_1.z.string()),
    dependencies: zod_1.z.array(zod_1.z.object({
        task: zod_1.z.string(),
        depends_on: zod_1.z.array(zod_1.z.string()),
    })),
    estimated_duration: zod_1.z.string(),
    risk_assessment: zod_1.z.string(),
});
const MultiAgentResponseSchema = zod_1.z.object({
    coordinated_response: zod_1.z.string(),
    agent_contributions: zod_1.z.array(zod_1.z.object({
        agent: zod_1.z.string(),
        contribution: zod_1.z.string(),
        confidence: zod_1.z.number().min(0).max(1),
    })),
    integrated_insights: zod_1.z.array(zod_1.z.string()),
    next_steps: zod_1.z.array(zod_1.z.string()),
    compliance_summary: zod_1.z.array(zod_1.z.string()),
});
class OrchestratorAgent extends base_agent_1.BaseAgent {
    constructor(context = {}) {
        super(context);
        this.initializeAgents();
    }
    initializeAgents() {
        this.agents = new Map([
            ['industrial-relations', new industrial_relations_agent_1.IndustrialRelationsAgent(this.context)],
            ['employee-relations', new employee_relations_agent_1.EmployeeRelationsAgent(this.context)],
            ['foreign-workers', new foreign_workers_agent_1.ForeignWorkersAgent(this.context)],
            ['compensation-benefits', new compensation_benefits_agent_1.CompensationBenefitsAgent(this.context)],
            ['talent-acquisition', new talent_acquisition_agent_1.TalentAcquisitionAgent(this.context)],
            ['learning-development', new learning_development_agent_1.LearningDevelopmentAgent(this.context)],
            ['performance-management', new performance_management_agent_1.PerformanceManagementAgent(this.context)],
            ['hr-analytics', new hr_analytics_agent_1.HRAnalyticsAgent(this.context)],
        ]);
    }
    async execute(input) {
        const { action, data, multi_agent = false } = input;
        if (multi_agent) {
            return await this.orchestrateMultiAgent(input);
        }
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
        }
        catch (error) {
            console.error(`Agent execution error for ${targetAgent}:`, error);
            return this.createResponse(false, null, `Failed to execute task with ${targetAgent} agent`);
        }
    }
    async orchestrateMultiAgent(input) {
        const { action, data } = input;
        const plan = await this.createOrchestrationPlan(action, data);
        if (!plan) {
            return this.createResponse(false, null, 'Failed to create orchestration plan');
        }
        const results = new Map();
        const executedAgents = [];
        for (const agentName of plan.execution_order) {
            const dependencies = plan.dependencies.find(d => d.task === agentName)?.depends_on || [];
            const unmetDeps = dependencies.filter(dep => !executedAgents.includes(dep));
            if (unmetDeps.length > 0) {
                console.warn(`Skipping ${agentName} due to unmet dependencies: ${unmetDeps.join(', ')}`);
                continue;
            }
            const agent = this.agents.get(agentName);
            if (!agent)
                continue;
            try {
                const agentInput = this.prepareAgentInput(agentName, data, results);
                const result = await agent.execute(agentInput);
                results.set(agentName, result);
                executedAgents.push(agentName);
            }
            catch (error) {
                console.error(`Multi-agent execution error for ${agentName}:`, error);
                results.set(agentName, this.createResponse(false, null, `Execution failed: ${error.message}`));
            }
        }
        return await this.integrateMultiAgentResults(results, plan);
    }
    determineTargetAgent(action, data) {
        const actionMapping = {
            'analyze_dispute': 'industrial-relations',
            'assess_strike_risk': 'industrial-relations',
            'review_agreement': 'industrial-relations',
            'analyze_emotion': 'employee-relations',
            'mediate_conflict': 'employee-relations',
            'assess_culture_health': 'employee-relations',
            'predict_permit_renewal': 'foreign-workers',
            'assess_compliance_risk': 'foreign-workers',
            'translate_communication': 'foreign-workers',
            'benchmark_salary': 'compensation-benefits',
            'personalize_benefits': 'compensation-benefits',
            'analyze_pay_equity': 'compensation-benefits',
            'calculate_zakat': 'compensation-benefits',
            'parse_resume': 'talent-acquisition',
            'screen_candidate': 'talent-acquisition',
            'analyze_interview': 'talent-acquisition',
            'analyze_skills_gap': 'learning-development',
            'create_learning_path': 'learning-development',
            'predict_training_roi': 'learning-development',
            'track_okr': 'performance-management',
            'analyze_feedback': 'performance-management',
            'assess_nine_box': 'performance-management',
            'predict_attrition_risk': 'hr-analytics',
            'plan_workforce': 'hr-analytics',
            'assess_compliance_health': 'hr-analytics',
        };
        return actionMapping[action] || null;
    }
    async createOrchestrationPlan(action, data) {
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
    prepareAgentInput(agentName, originalData, previousResults) {
        const enhancedData = { ...originalData };
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
    async integrateMultiAgentResults(results, plan) {
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
            const combinedData = Object.fromEntries(successfulResults.map(([agent, result]) => [agent, result.data]));
            return this.createResponse(true, combinedData, 'Multi-agent execution completed with manual integration', ['Results integrated manually', 'Review individual agent outputs for details']);
        }
        return this.createResponse(true, integration, 'Multi-agent orchestration completed successfully', integration.compliance_summary);
    }
    enhanceResponseWithOrchestration(result, agentName) {
        if (!result.success)
            return result;
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
    async orchestrateEmployeeLifecycle(employeeData) {
        return await this.orchestrateMultiAgent({
            action: 'employee_lifecycle',
            data: employeeData,
            multi_agent: true,
        });
    }
    async orchestrateComplianceAudit(auditData) {
        return await this.orchestrateMultiAgent({
            action: 'compliance_audit',
            data: auditData,
            multi_agent: true,
        });
    }
    async orchestrateWorkforcePlanning(planningData) {
        return await this.orchestrateMultiAgent({
            action: 'workforce_planning',
            data: planningData,
            multi_agent: true,
        });
    }
    async orchestratePerformanceReview(reviewData) {
        return await this.orchestrateMultiAgent({
            action: 'performance_review',
            data: reviewData,
            multi_agent: true,
        });
    }
}
exports.OrchestratorAgent = OrchestratorAgent;
//# sourceMappingURL=orchestrator-agent.js.map