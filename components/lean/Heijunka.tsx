import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter, PlanTrigger } from '../ai-elements/plan';
import { Suggestion, Suggestions } from '../ai-elements/suggestion';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent, ArtifactActions, ArtifactAction } from '../ai-elements/artifact';
import { Task, TaskTrigger, TaskContent, TaskItem } from '../ai-elements/task';
import { Controls } from '../ai-elements/controls';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements/reasoning';
import { ChartCard } from '../charts/ChartCard';

export function Heijunka() {
  return (
    <div className="space-y-4">
      <ChartCard
        title="Heijunka — Production Leveling"
        description="Load leveling and production smoothing"
        kpi="78%"
        trend="up"
        trendLabel="leveling rate — target: 85%"
        aiInsight="AI-suggestion: Increase Product A mix by 20%"
      >
        <Plan defaultOpen={true}>
          <PlanHeader>
            <PlanTitle>Production Leveling Plan</PlanTitle>
            <PlanDescription>Target: 85% leveling rate by Q3 2026</PlanDescription>
          </PlanHeader>
          <PlanTrigger />
          <PlanContent>
            <div className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
              <div>1. Level load across Lines A-D (Even out peaks)</div>
              <div>2. Create mixed-model schedule for 8-hour shifts</div>
              <div>3. Reduce batch sizes by 40% for better flow</div>
            </div>
          </PlanContent>
          <PlanFooter>
            <div className="text-xs" style={{ color: '#4d5468' }}>Current batching: 480 units — Target: 288 units</div>
          </PlanFooter>
        </Plan>
      </ChartCard>

      <Suggestions>
        <Suggestion suggestion="Adjust mix: Product A +20% to match demand profile" />
        <Suggestion suggestion="Reduce changeover time on Line C by 15 min" />
      </Suggestions>

      <Reasoning defaultOpen={false}>
        <ReasoningTrigger />
        <ReasoningContent>
          {`Leveling Analysis:
1. Current leveling rate: 78% (target: 85%)
2. Product A demand exceeds production by 22%
3. Recommendation: Implement 2-hour mixed-model cycles
4. Expected improvement: +7% leveling rate within 2 weeks`}
        </ReasoningContent>
      </Reasoning>

      <Task defaultOpen={false}>
        <TaskTrigger title="Leveling Actions" />
        <TaskContent>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Adjust production schedule — rebalance Load</span>
            </div>
          </TaskItem>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Optimize cycle times — reduce changeover</span>
            </div>
          </TaskItem>
        </TaskContent>
      </Task>

      <Controls />

      <Artifact>
        <ArtifactHeader>
          <ArtifactTitle>Leveling Chart — Mixed-Model Schedule</ArtifactTitle>
          <ArtifactActions>
            <ArtifactAction tooltip="Export schedule" label="Export" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <div className="text-sm" style={{ color: '#8b92a9' }}>
            Production schedule leveled across 4 lines with 8-hour mixed-model cycles.
            Batch sizes reduced from 480 to 288 units for improved flow efficiency.
          </div>
        </ArtifactContent>
      </Artifact>
    </div>
  );
}
