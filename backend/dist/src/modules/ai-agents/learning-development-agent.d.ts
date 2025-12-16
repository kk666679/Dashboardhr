import { BaseAgent, AgentResponse } from './base-agent';
export declare class LearningDevelopmentAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private analyzeSkillsGap;
    private createLearningPath;
    private recommendMicroLearning;
    private predictTrainingROI;
    private simulateCompetency;
}
