import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent, ArtifactActions, ArtifactAction } from '../ai-elements/artifact';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements/reasoning';
import { Conversation, ConversationHeader, ConversationContent } from '../ai-elements/conversation';
import { Agent, AgentHeader, AgentStatusDot } from '../ai-elements/agent';
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter, PlanTrigger } from '../ai-elements/plan';
import { Timeline, TimelineEventItem } from '../ai-elements/timeline';
import { ChartCard } from '../charts/ChartCard';

export function A3Report() {
  return (
    <div className="space-y-4">
      <ChartCard title="A3 Problem Solving Report" description="Structured problem-solving for Press #3 defects" kpi="$840K" trend="down" trendLabel="COPQ improvement" aiInsight="Root cause: hydraulic seal wear">
        <Agent>
          <AgentHeader name="A3 Analysis Agent" model="gpt-4o" status="done" actions={<span className="flex items-center gap-1 text-xs" style={{ color: '#00d68f' }}><AgentStatusDot status="done" />Analysis complete</span>} />
        </Agent>
      </ChartCard>

      <Plan defaultOpen={true}>
        <PlanHeader>
          <PlanTitle>A3 Action Plan</PlanTitle>
          <PlanDescription>Problem: 5,800 DPMO on Press #3</PlanDescription>
        </PlanHeader>
        <PlanTrigger />
        <PlanContent>
          <ul className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
            <li>1. Problem: Dimensional non-conformances on Press #3</li>
            <li>2. Root Cause: Hydraulic cylinder seal wear</li>
            <li>3. Countermeasure: Install IoT sensors</li>
            <li>4. Verification: Target 3,400 DPMO</li>
          </ul>
        </PlanContent>
        <PlanFooter>
          <div className="flex justify-between w-full text-xs" style={{ color: '#4d5468' }}>
            <span>Owner: Marcus Kim</span>
            <span>Due: Aug 31, 2026</span>
          </div>
        </PlanFooter>
      </Plan>

      <Reasoning defaultOpen={true}>
        <ReasoningTrigger />
        <ReasoningContent>1. Problem: 5,800 DPMO - 42% dimensional, 31% surface finish\n2. Current State: Press #3 force inconsistency\n3. Root Cause: Hydraulic cylinder seal worn\n4. Target State: 3,400 DPMO</ReasoningContent>
      </Reasoning>

      <Artifact>
        <ArtifactHeader>
          <ArtifactTitle>A3 Document</ArtifactTitle>
          <ArtifactActions>
            <ArtifactAction tooltip="Export A3 PDF" label="Export" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <div className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
            <div>Team: Marcus Kim (MBB), Sarah Chen (Champion)</div>
            <div>Status: IoT sensor installation in progress (Week 3 of 8)</div>
          </div>
        </ArtifactContent>
      </Artifact>

      <Timeline>
        <TimelineEventItem event={{ id: 'a3-1', status: 'completed', title: 'Problem identification', description: 'DPMO analysis complete' }} isLast={false} />
        <TimelineEventItem event={{ id: 'a3-2', status: 'completed', title: 'Root cause analysis', description: 'Hydraulic seal identified' }} isLast={false} />
        <TimelineEventItem event={{ id: 'a3-3', status: 'running', title: 'IoT sensor installation', description: 'In progress' }} isLast={false} />
        <TimelineEventItem event={{ id: 'a3-4', status: 'pending', title: 'Verify DPMO reduction', description: 'Target: 3,400 DPMO' }} isLast={true} />
      </Timeline>

      <Conversation>
        <ConversationHeader title="A3 Collaboration" />
        <ConversationContent>
          <div className="text-sm" style={{ color: '#8b92a9' }}>Collaborate on A3 problem solving - add comments, suggestions, or status updates.</div>
        </ConversationContent>
      </Conversation>
    </div>
  );
}
