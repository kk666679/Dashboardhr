import { BaseAgent, AgentResponse } from './base-agent';
export declare class ForeignWorkersAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private predictPermitRenewal;
    private assessComplianceRisk;
    private translateCommunication;
    private analyzeAgencyPerformance;
    private optimizeLevyCalculations;
}
