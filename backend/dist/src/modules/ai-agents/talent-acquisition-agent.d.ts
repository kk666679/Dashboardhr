import { BaseAgent, AgentResponse } from './base-agent';
export declare class TalentAcquisitionAgent extends BaseAgent {
    execute(input: any): Promise<AgentResponse>;
    private parseResume;
    private screenCandidate;
    private analyzeInterview;
    private predictQualityOfHire;
    private engageCandidate;
}
