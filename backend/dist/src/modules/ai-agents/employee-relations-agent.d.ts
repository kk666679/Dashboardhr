import { BaseAgent, AgentResponse } from './base-agent';
export declare class EmployeeRelationsAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private analyzeEmotion;
    private mediateConflict;
    private assessCultureHealth;
    private predictERCase;
    private generateInvestigation;
}
