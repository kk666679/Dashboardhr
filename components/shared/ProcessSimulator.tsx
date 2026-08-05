import { Agent, AgentHeader, AgentStatusDot } from '../ai-elements';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent } from '../ai-elements';

export const ProcessSimulator = () => (
  <div className="space-y-4">
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Simulation runs</label>
      <input type="number" defaultValue={1000} className="border rounded px-3 py-2 text-sm" />
    </div>
    <Agent>
      <AgentHeader
        name="Simulation Agent"
        model="monte-carlo-v1"
        status="streaming"
        actions={<span className="flex items-center gap-1 text-xs"><AgentStatusDot status="streaming" />Running...</span>}
      />
    </Agent>
    <Artifact>
      <ArtifactHeader>
        <ArtifactTitle>Simulation Results</ArtifactTitle>
      </ArtifactHeader>
      <ArtifactContent>Chart data will appear here</ArtifactContent>
    </Artifact>
  </div>
);
