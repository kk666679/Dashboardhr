import { BaseAgent, AgentResponse } from './base-agent';
export declare class HRAnalyticsAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private predictAttritionRisk;
    private planWorkforce;
    private assessComplianceHealth;
    private analyzeCultureMetrics;
    private calculateHRROI;
}
