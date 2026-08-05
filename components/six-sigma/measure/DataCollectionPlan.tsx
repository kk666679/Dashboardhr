import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter } from '../../ai-elements/plan';
import { Task, TaskTrigger, TaskContent, TaskItem } from '../../ai-elements/task';
import { Controls } from '../../ai-elements/controls';
import { Agent, AgentHeader, AgentStatusDot } from '../../ai-elements/agent';
import { Suggestion, Suggestions } from '../../ai-elements/suggestion';

export const DataCollectionPlan = () => (
  <div className="space-y-4">
    <Agent>
      <AgentHeader name="Data Collection Agent" model="gpt-4o" status="idle" actions={
        <span className="flex items-center gap-1 text-xs" style={{ color: '#8b92a9' }}>
          <AgentStatusDot status="idle" /> Ready
        </span>
      } />
    </Agent>

    <Suggestions>
      <Suggestion suggestion="Recommended sample size: 847 units for 95% confidence level" />
      <Suggestion suggestion="Stratified sampling by shift: Day (60%), Night (40%)" />
    </Suggestions>

    <Plan defaultOpen={true}>
      <PlanHeader>
        <PlanTitle>Data Collection Plan</PlanTitle>
        <PlanDescription>Line B defect data — Press Section</PlanDescription>
      </PlanHeader>
      <PlanContent>
        <ul className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
          <li>1. Define sampling: 847 units across all shifts</li>
          <li>2. Collect data: Dimensional & surface measurements</li>
          <li>3. Validate: Gauge below than 20% before analysis</li>
        </ul>
      </PlanContent>
      <PlanFooter>
        <div className="text-xs" style={{ color: '#4d5468' }}>Target completion: Week 2 of Measure phase</div>
      </PlanFooter>
    </Plan>

    <Task defaultOpen={true}>
      <TaskTrigger title="Data Collection Tasks" />
      <TaskContent>
        <TaskItem>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Assign data collector for Line B Press Section</span>
          </div>
        </TaskItem>
        <TaskItem>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Calibrate measurement tools before collection</span>
          </div>
        </TaskItem>
      </TaskContent>
    </Task>

    <Controls />
  </div>
);
