import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent, ArtifactActions, ArtifactAction } from '../ai-elements/artifact';
import { Suggestion, Suggestions } from '../ai-elements/suggestion';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements/reasoning';
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter } from '../ai-elements/plan';
import { Timeline, TimelineEventItem } from '../ai-elements/timeline';
import { ChartCard } from '../charts/ChartCard';

export const ValueStreamMap = () => (
  <div className="space-y-4">
    {/* VSM Artifact with ChartCard */}
    <ChartCard
      title="Value Stream Map"
      description="Current state mapping — Process steps with value-add analysis"
      kpi="28.4%"
      trend="down"
      trendLabel="Flow efficiency — needs improvement"
      aiInsight="AI-detected bottleneck at Inspection step"
    >
      <Artifact>
        <ArtifactHeader>
          <ArtifactTitle>VSM — Current State</ArtifactTitle>
          <ArtifactActions>
            <ArtifactAction tooltip="Export VSM" label="Export" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <div className="text-sm" style={{ color: '#8b92a9' }}>
            Value Stream Map showing process flow with value-added vs non-value-added time.
            Recommended action: Focus on reducing NVA at Receive (45min) and Press (22min) steps.
          </div>
        </ArtifactContent>
      </Artifact>
    </ChartCard>

    {/* AI Suggestions */}
    <Suggestions>
      <Suggestion suggestion="🔴 Bottleneck at step 3 (Press) — 360 units WIP" />
      <Suggestion suggestion="⬇️ Reduce NVA at Receive: 45 min waiting" />
    </Suggestions>

    {/* Reasoning */}
    <Reasoning defaultOpen={true}>
      <ReasoningTrigger />
      <ReasoningContent>
        Cycle Time Analysis:
        1. Total VA: 41 min | Total NVA: 129 min
        2. Flow Efficiency: 24.1% — target is more than 30%
        3. Primary bottleneck: Press step with 360 units WIP
        4. Recommendation: Implement pull system between Inspect → Press
      </ReasoningContent>
    </Reasoning>

    {/* Improvement Plan */}
    <Plan defaultOpen={false}>
      <PlanHeader>
        <PlanTitle>VSM Improvement Plan</PlanTitle>
        <PlanDescription>Target: Achieve 35% flow efficiency in Q3</PlanDescription>
      </PlanHeader>
      <PlanContent>
        <div className="space-y-3 text-sm" style={{ color: '#8b92a9' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Step 1: Reduce batch size at Press from 360 to 120 units</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Step 2: Implement milk-run material delivery every 90min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Step 3: Combine QC + Pack into single flow cell</span>
          </div>
        </div>
      </PlanContent>
      <PlanFooter>
        <div className="flex justify-between w-full text-xs" style={{ color: '#4d5468' }}>
          <span>Est. savings: $94K/yr</span>
          <span>Target: Jul 2026</span>
        </div>
      </PlanFooter>
    </Plan>

    {/* Timeline */}
    <Timeline>
      <TimelineEventItem
        event={{
          id: 'vsm-1',
          status: 'completed',
          title: 'Current state mapping complete',
          description: 'Identified 8 process steps with cycle times',
        }}
        isLast={false}
      />
      <TimelineEventItem
        event={{
          id: 'vsm-2',
          status: 'running',
          title: 'Future state design in progress',
          description: 'Targeting 35% flow efficiency improvement',
        }}
        isLast={true}
      />
    </Timeline>
  </div>
);
