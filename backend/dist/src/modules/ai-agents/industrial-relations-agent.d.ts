import { BaseAgent, AgentResponse } from './base-agent';
export declare class IndustrialRelationsAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private analyzeDispute;
    private assessStrikeRisk;
    private reviewCollectiveAgreement;
    private generateCaseDocumentation;
}
