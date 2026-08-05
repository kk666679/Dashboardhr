import { Agent, AgentHeader, AgentStatusDot } from '../ai-elements/agent';
import { Controls } from '../ai-elements/controls';
import { StackTrace, StackTraceHeader, StackTraceError, StackTraceErrorMessage, StackTraceActions, StackTraceCopyButton, StackTraceExpandButton, StackTraceContent, StackTraceFrames } from '../ai-elements/stack-trace';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements/reasoning';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../ai-elements/sources';
import { Suggestion, Suggestions } from '../ai-elements/suggestion';
import { ChartCard } from '../charts/ChartCard';

export function Jidoka() {
  return (
    <div className="space-y-4">
      <ChartCard
        title="Jidoka — Automation with Human Touch"
        description="Autonomous defect detection and machine monitoring"
        kpi="3"
        trend="up"
        trendLabel="anomalies detected this shift"
        aiInsight="AI-monitoring: Press #3 vibration anomaly"
      >
        <Agent>
          <AgentHeader
            name="Jidoka Monitor"
            model="anomaly-detection-v2"
            status="thinking"
            actions={
              <span className="flex items-center gap-1 text-xs" style={{ color: '#00d4ff' }}>
                <AgentStatusDot status="thinking" />
                Monitoring 4 lines
              </span>
            }
          />
        </Agent>
      </ChartCard>

      <Suggestions>
        <Suggestion suggestion="Press #3 vibration exceeds threshold — recommend auto-stop" />
        <Suggestion suggestion="Calibration drift detected on Line C coaters" />
      </Suggestions>

      <Reasoning defaultOpen={true}>
        <ReasoningTrigger />
        <ReasoningContent>
          {`Anomaly Detection Analysis:
1. Press #3 vibration signature deviates 34% from baseline
2. Hydraulic cylinder seal wear identified as root cause
3. Auto-stop engaged at 14:23 - preventing 12 potential defect units
4. Recommendation: Condition-based maintenance trigger at >25% deviation`}
        </ReasoningContent>
      </Reasoning>

      <Controls />

      <StackTrace trace={'Error: Anomaly detected at 14:23\n  at checkPressVibration (monitor.ts:142:18)\n  at runAnomalyDetection (engine.ts:89:12)\n  at processShift (schedule.ts:34:8)'}>
        <StackTraceHeader>
          <StackTraceError>
            <StackTraceErrorMessage />
          </StackTraceError>
          <StackTraceActions>
            <StackTraceCopyButton />
            <StackTraceExpandButton />
          </StackTraceActions>
        </StackTraceHeader>
        <StackTraceContent>
          <StackTraceFrames />
        </StackTraceContent>
      </StackTrace>

      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Anomaly Detection Config v2.1" href="/dashboard/documents/repository" />
          <Source title="Press #3 Maintenance Log" href="/dashboard/reports/workforce" />
        </SourcesContent>
      </Sources>
    </div>
  );
}
