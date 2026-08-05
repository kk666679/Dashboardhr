import { Checkpoint, CheckpointTrigger, CheckpointIcon } from '../../ai-elements/checkpoint';
import { Timeline, TimelineEventItem } from '../../ai-elements/timeline';
import { Agent, AgentHeader, AgentStatusDot } from '../../ai-elements/agent';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent, ArtifactActions, ArtifactAction } from '../../ai-elements/artifact';
import { Suggestion, Suggestions } from '../../ai-elements/suggestion';

export const ProjectCharter = () => (
  <div className="space-y-4">
    <Agent>
      <AgentHeader name="Charter Update Agent" model="gpt-4o" status="idle" actions={
        <span className="flex items-center gap-1 text-xs" style={{ color: '#8b92a9' }}>
          <AgentStatusDot status="idle" /> Ready
        </span>
      } />
    </Agent>

    <Suggestions>
      <Suggestion suggestion="Update problem statement with latest DPMO data (5,800)" />
      <Suggestion suggestion="Add financial benefit: $480K annualized COPQ reduction target" />
    </Suggestions>

    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger tooltip="Charter approval status">
        <span className="text-xs" style={{ color: '#00d68f' }}>Charter Approved — Mar 1, 2026</span>
      </CheckpointTrigger>
    </Checkpoint>

    <Artifact>
      <ArtifactHeader>
        <ArtifactTitle>Project Charter — Line B Defect Reduction</ArtifactTitle>
        <ArtifactActions>
          <ArtifactAction tooltip="Export charter" label="Export" />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded" style={{ background: '#161820' }}>
            <div className="text-xs" style={{ color: '#4d5468' }}>Project</div>
            <div style={{ color: '#f0f2f7' }}>Line B Defect Reduction</div></div>
          <div className="p-2 rounded" style={{ background: '#161820' }}>
            <div className="text-xs" style={{ color: '#4d5468' }}>Champion</div>
            <div style={{ color: '#f0f2f7' }}>Sarah Chen</div></div>
          <div className="p-2 rounded" style={{ background: '#161820' }}>
            <div className="text-xs" style={{ color: '#4d5468' }}>MBB</div>
            <div style={{ color: '#f0f2f7' }}>Marcus Kim</div></div>
          <div className="p-2 rounded" style={{ background: '#161820' }}>
            <div className="text-xs" style={{ color: '#4d5468' }}>Target</div>
            <div style={{ color: '#f0f2f7' }}>Aug 31, 2026</div></div>
        </div>
      </ArtifactContent>
    </Artifact>

    <Timeline>
      <TimelineEventItem event={{ id: 'pc-1', status: 'completed', title: 'Charter created & approved', description: 'Mar 1, 2026' }} isLast={false} />
      <TimelineEventItem event={{ id: 'pc-2', status: 'running', title: 'DMAIC in progress', description: 'Define phase complete' }} isLast={false} />
      <TimelineEventItem event={{ id: 'pc-3', status: 'pending', title: 'Target completion', description: 'Aug 31, 2026' }} isLast={true} />
    </Timeline>
  </div>
);
