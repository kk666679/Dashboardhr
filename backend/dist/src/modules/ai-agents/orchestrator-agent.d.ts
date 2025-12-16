import { BaseAgent, AgentResponse, AgentContext } from './base-agent';
export declare class OrchestratorAgent extends BaseAgent {
    private agents;
    constructor(context?: AgentContext);
    private initializeAgents;
    execute(input: any): Promise<AgentResponse>;
    private orchestrateMultiAgent;
    private determineTargetAgent;
    private createOrchestrationPlan;
    private prepareAgentInput;
    private integrateMultiAgentResults;
    private enhanceResponseWithOrchestration;
    orchestrateEmployeeLifecycle(employeeData: any): Promise<AgentResponse>;
    orchestrateComplianceAudit(auditData: any): Promise<AgentResponse>;
    orchestrateWorkforcePlanning(planningData: any): Promise<AgentResponse>;
    orchestratePerformanceReview(reviewData: any): Promise<AgentResponse>;
}
