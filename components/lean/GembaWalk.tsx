import { Agent, AgentHeader, AgentStatusDot } from '../ai-elements/agent';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent, ArtifactActions, ArtifactAction } from '../ai-elements/artifact';
import { Suggestion, Suggestions } from '../ai-elements/suggestion';
import { Checkpoint, CheckpointTrigger, CheckpointIcon } from '../ai-elements/checkpoint';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../ai-elements/sources';
import { Timeline, TimelineEventItem } from '../ai-elements/timeline';
import { ChartCard } from '../charts/ChartCard';

export function GembaWalk() {
  return (
    <div className="space-y-4">
      <ChartCard
        title="Gemba Walk"
        description="Shop floor observation and leadership engagement tracker"
        kpi="12"
        trend="up"
        trendLabel="walks this month"
        aiInsight="AI-recommended: Increase frequency in Line B"
      >
        <Agent>
          <AgentHeader
            name="Gemba Transcription Agent"
            model="whisper-1"
            status="idle"
            actions={
              <span className="flex items-center gap-1 text-xs" style={{ color: '#8b92a9' }}>
                <AgentStatusDot status="idle" />
                Ready
              </span>
            }
          />
        </Agent>
      </ChartCard>

      <Suggestions>
        <Suggestion suggestion="Safety: Loose railing observed at Press #3" />
        <Suggestion suggestion="Quality: Operator identified coating parameter drift" />
        <Suggestion suggestion="5S: Shadow board missing 2 tools at Station 4" />
      </Suggestions>

      <Artifact>
        <ArtifactHeader>
          <ArtifactTitle>Gemba Walk Report</ArtifactTitle>
          <ArtifactActions>
            <ArtifactAction tooltip="Export report" label="Export" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <div className="space-y-3 text-sm" style={{ color: '#8b92a9' }}>
            <div><strong>Line A:</strong> Running at 92% OEE. No critical issues.</div>
            <div><strong>Line B:</strong> Operator flagged Press #3 vibration</div>
            <div><strong>Line C:</strong> Coating parameter drift detected</div>
            <div><strong>Safety:</strong> Loose railing near Press #2 reported</div>
          </div>
        </ArtifactContent>
      </Artifact>

      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger tooltip="Next Gemba Walk scheduled">
          <span className="text-xs" style={{ color: '#00d4ff' }}>Next Walk: Jul 28</span>
        </CheckpointTrigger>
      </Checkpoint>

      <Sources>
        <SourcesTrigger count={3} />
        <SourcesContent>
          <Source title="Gemba Walk Standard Work" href="/dashboard/documents/templates" />
          <Source title="Observation Log July 2026" href="/dashboard/reports/workforce" />
          <Source title="CAPA Tracking Sheet" href="/dashboard/compliance/corrective-actions" />
        </SourcesContent>
      </Sources>

      <Timeline>
        <TimelineEventItem event={{ id: 'gw-1', status: 'completed', title: 'Gemba Walk Line A', description: 'OEE 92%' }} isLast={false} showTimestamp={true} />
        <TimelineEventItem event={{ id: 'gw-2', status: 'completed', title: 'Gemba Walk Line B', description: 'Vibration anomaly' }} isLast={false} showTimestamp={true} />
        <TimelineEventItem event={{ id: 'gw-3', status: 'warning', title: 'Line B CAPA opened', description: 'Press #3 vibration' }} isLast={true} />
      </Timeline>
    </div>
  );
}
