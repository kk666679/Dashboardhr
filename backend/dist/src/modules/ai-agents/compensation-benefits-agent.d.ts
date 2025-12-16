import { BaseAgent, AgentResponse } from './base-agent';
export declare class CompensationBenefitsAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private benchmarkSalary;
    private personalizeBenefits;
    private analyzePayEquity;
    private generateTotalRewards;
    private forecastCostOfLiving;
    private calculateZakat;
    private optimizeEPFContribution;
}
