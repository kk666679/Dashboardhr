import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter } from '../../ai-elements/plan';
import { Conversation, ConversationHeader, ConversationContent } from '../../ai-elements/conversation';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent, ArtifactActions, ArtifactAction } from '../../ai-elements/artifact';
import { Agent, AgentHeader, AgentStatusDot } from '../../ai-elements/agent';
import { Timeline, TimelineEventItem } from '../../ai-elements/timeline';
import { Suggestion, Suggestions } from '../../ai-elements/suggestion';

export const AIKaizenEvent = () => (
  <div className="space-y-4">
    <Agent>
      <AgentHeader name="Kaizen Facilitator Agent" model="gpt-4o" status="idle" actions={
        <span className="flex items-center gap-1 text-xs" style={{ color: '#8b92a9' }}>
          <AgentStatusDot status="idle" /> Ready
        </span>
      } />
    </Agent>

    <Suggestions>
      <Suggestion suggestion="Focus on Press #3 setup time reduction — target: 50% reduction" />
      <Suggestion suggestion="Apply PDCA cycle — Define clear kaizen objectives first" />
      <Suggestion suggestion="Include cross-functional team: ops, maintenance, quality" />
    </Suggestions>

    <Conversation>
      <ConversationHeader title="Kaizen Event Facilitation" />
      <ConversationContent>
        <div className="text-sm py-2" style={{ color: '#8b92a9' }}>
          Use the chat below to facilitate the kaizen event, document ideas, and track progress.
        </div>
      </ConversationContent>
    </Conversation>

    <Plan defaultOpen={true}>
      <PlanHeader>
        <PlanTitle>Kaizen Event Plan</PlanTitle>
        <PlanDescription>Press #3 Setup Time Reduction — Target: 50% reduction (from 45min to 22.5min)</PlanDescription>
      </PlanHeader>
      <PlanContent>
        <ul className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
          <li>1. Plan: Define scope, assemble team, gather baseline data (Week 1)</li>
          <li>2. Execute: SMED implementation — separate internal/external setup (Week 2)</li>
          <li>3. Review: Measure new setup time, document standard work (Week 3)</li>
          <li>4. Act: Roll out to Line C and Line D (Week 4)</li>
        </ul>
      </PlanContent>
      <PlanFooter>
        <div className="flex justify-between w-full text-xs" style={{ color: '#4d5468' }}>
          <span>Target savings: $128K/yr</span>
          <span>Duration: 4 weeks</span>
        </div>
      </PlanFooter>
    </Plan>

    <Artifact>
      <ArtifactHeader>
        <ArtifactTitle>Kaizen Results — Before/After</ArtifactTitle>
        <ArtifactActions>
          <ArtifactAction tooltip="Export kaizen report" label="Export" />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg" style={{ background: '#161820' }}>
            <div className="text-xs mb-1" style={{ color: '#4d5468' }}>Before</div>
            <div className="text-lg font-bold" style={{ color: '#ff4d6d', fontFamily: 'Geist Mono' }}>45 min</div>
            <div className="text-xs" style={{ color: '#8b92a9' }}>Setup time</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: '#161820' }}>
            <div className="text-xs mb-1" style={{ color: '#4d5468' }}>After (Target)</div>
            <div className="text-lg font-bold" style={{ color: '#00d68f', fontFamily: 'Geist Mono' }}>22.5 min</div>
            <div className="text-xs" style={{ color: '#8b92a9' }}>Setup time</div>
          </div>
        </div>
      </ArtifactContent>
    </Artifact>

    <Timeline>
      <TimelineEventItem event={{ id: 'kz-1', status: 'completed', title: 'Week 1: Planning & baseline', description: 'Current setup: 45min' }} isLast={false} />
      <TimelineEventItem event={{ id: 'kz-2', status: 'running', title: 'Week 2: SMED implementation', description: 'Internal/external separation' }} isLast={false} />
      <TimelineEventItem event={{ id: 'kz-3', status: 'pending', title: 'Week 3: Review & standardize', description: 'Target: 22.5min' }} isLast={false} />
      <TimelineEventItem event={{ id: 'kz-4', status: 'pending', title: 'Week 4: Roll out', description: 'Lines C & D' }} isLast={true} />
    </Timeline>
  </div>
);
