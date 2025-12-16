import { BaseAgent, AgentResponse } from './base-agent';
export declare class PerformanceManagementAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private trackOKR;
    private analyzeFeedback;
    private assessNineBox;
    private simulateCareerPath;
    private detectBias;
}
