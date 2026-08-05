import { Reasoning, ReasoningTrigger, ReasoningContent } from '../../ai-elements/reasoning';
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter } from '../../ai-elements/plan';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent } from '../../ai-elements/artifact';
import { Agent, AgentHeader, AgentStatusDot } from '../../ai-elements/agent';
import { Suggestion, Suggestions } from '../../ai-elements/suggestion';

export const CTQTree = () => (
  <div className="space-y-4">
    <Agent>
      <AgentHeader name="CTQ Mapping Agent" model="gpt-4o" status="done" actions={
        <span className="flex items-center gap-1 text-xs" style={{ color: '#00d68f' }}>
          <AgentStatusDot status="done" /> Analysis complete
        </span>
      } />
    </Agent>

    <Suggestions>
      <Suggestion suggestion="Primary CTQ: Dimensional tolerance ±0.05mm — linked to 42% of defects" />
      <Suggestion suggestion="Surface finish Ra < 0.8μm — customer critical-to-satisfaction" />
    </Suggestions>

    <Reasoning defaultOpen={true}>
      <ReasoningTrigger />
      <ReasoningContent>
        CTQ Mapping Process:
        1. Customer needs identified from VOC: "Parts must fit first time"
        2. Critical-to-Quality: Dimensional tolerance ±0.05mm
        3. Specification limits: LSL = -0.05mm, USL = +0.05mm
        4. Current performance: 5,800 DPMO → target 3,400 DPMO
      </ReasoningContent>
    </Reasoning>

    <Plan defaultOpen={true}>
      <PlanHeader>
        <PlanTitle>CTQ Tree Action Plan</PlanTitle>
        <PlanDescription>Define and validate CTQs with stakeholders</PlanDescription>
      </PlanHeader>
      <PlanContent>
        <ul className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
          <li>1. Define CTQ: Dimensional tolerance ±0.05mm (critical)</li>
          <li>2. Set targets: 3,400 DPMO (4.5σ) by Q4 2026</li>
          <li>3. Validate with stakeholders: Customer quality team signoff</li>
        </ul>
      </PlanContent>
      <PlanFooter>
        <div className="text-xs" style={{ color: '#4d5468' }}>Target: 4.5σ (3,400 DPMO) from current 4.1σ (5,800 DPMO)</div>
      </PlanFooter>
    </Plan>

    <Artifact>
      <ArtifactHeader>
        <ArtifactTitle>CTQ Tree Diagram</ArtifactTitle>
      </ArtifactHeader>
      <ArtifactContent>
        <div className="text-sm" style={{ color: '#8b92a9' }}>
          VOC: "Parts must fit" → CTQ: Dimensional tolerance → Spec: ±0.05mm → Metric: DPMO
        </div>
      </ArtifactContent>
    </Artifact>
  </div>
);
