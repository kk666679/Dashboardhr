import { useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Task, TaskTrigger, TaskContent, TaskItem } from '../ai-elements/task';
import { Timeline, TimelineEventItem } from '../ai-elements/timeline';
import { Conversation, ConversationHeader, ConversationContent } from '../ai-elements/conversation';
import { Suggestion, Suggestions } from '../ai-elements/suggestion';
import { Checkpoint, CheckpointTrigger, CheckpointIcon } from '../ai-elements/checkpoint';
import { Sources, SourcesTrigger, SourcesContent, Source } from '../ai-elements/sources';

const auditAreas = [
  { zone: 'Station 4', sort: 82, setInOrder: 75, shine: 90, standardize: 68, sustain: 71, status: 'needs-improvement' as const },
  { zone: 'Press Area', sort: 95, setInOrder: 92, shine: 88, standardize: 85, sustain: 79, status: 'good' as const },
  { zone: 'Assembly', sort: 78, setInOrder: 70, shine: 85, standardize: 72, sustain: 65, status: 'needs-improvement' as const },
  { zone: 'Warehouse', sort: 88, setInOrder: 84, shine: 76, standardize: 80, sustain: 82, status: 'good' as const },
]

export const FiveSAudit = () => {
  const [auditMessages, setAuditMessages] = useState<Array<{role: string; content: string}>>([])

  return (
    <div className="space-y-4">
      <Conversation>
        <ConversationHeader title="5S Audit Log" messageCount={auditMessages.length} />
        <ConversationContent>
          {auditMessages.length === 0 ? (
            <div className="text-sm py-4" style={{ color: '#8b92a9' }}>Add observations to start the 5S audit log...</div>
          ) : (
            auditMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className="px-3 py-1.5 rounded-lg text-xs max-w-[80%]"
                  style={{ background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(124,92,252,0.1)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2f7' }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </ConversationContent>
      </Conversation>

      <Suggestions>
        <Suggestion suggestion="Shadow board missing 2 tools at Station 4" onClick={(s) => setAuditMessages([...auditMessages, { role: 'user', content: s }])} />
        <Suggestion suggestion="Press Area: 5S score 88% — best practice area" onClick={(s) => setAuditMessages([...auditMessages, { role: 'user', content: s }])} />
        <Suggestion suggestion="Assembly: Standardize score low (72%) — update SOPs" onClick={(s) => setAuditMessages([...auditMessages, { role: 'user', content: s }])} />
      </Suggestions>

      {/* Audit scores summary */}
      <div className="grid grid-cols-2 gap-3">
        {auditAreas.map((area) => {
          const avgScore = Math.round((area.sort + area.setInOrder + area.shine + area.standardize + area.sustain) / 5)
          return (
            <div key={area.zone} className="rounded-xl p-4" style={{ background: '#161820', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#f0f2f7' }}>{area.zone}</span>
                <div className="flex items-center gap-1 text-xs" style={{ color: avgScore >= 80 ? '#00d68f' : '#ffaa00' }}>
                  {avgScore >= 80 ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span style={{ fontFamily: 'Geist Mono' }}>{avgScore}%</span>
                </div>
              </div>
              {(['sort', 'setInOrder', 'shine', 'standardize', 'sustain'] as const).map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs mb-1">
                  <span className="w-20" style={{ color: '#4d5468' }}>{s.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${area[s]}%`, background: area[s] >= 80 ? '#00d68f' : area[s] >= 70 ? '#ffaa00' : '#ff4d6d' }} />
                  </div>
                  <span style={{ color: '#8b92a9', fontFamily: 'Geist Mono', width: 28, textAlign: 'right' }}>{area[s]}%</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <Task defaultOpen={true}>
        <TaskTrigger title="5S Action Items" />
        <TaskContent>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Station 4: Replace missing tools on shadow board</span>
            </div>
          </TaskItem>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Assembly: Standardize work instructions (score: 72%)</span>
            </div>
          </TaskItem>
          <TaskItem>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Sustain: Implement daily 5-min 5S checks</span>
            </div>
          </TaskItem>
        </TaskContent>
      </Task>

      <Checkpoint>
        <CheckpointIcon />
        <CheckpointTrigger tooltip="Next audit scheduled">
          <span className="text-xs" style={{ color: '#00d4ff' }}>Next 5S Audit: Aug 2, 2026</span>
        </CheckpointTrigger>
      </Checkpoint>

      <Timeline>
        <TimelineEventItem event={{ id: '5s-1', status: 'completed', title: 'Jul 26 Audit — Press Area', description: 'Score: 88%' }} isLast={false} showTimestamp={true} />
        <TimelineEventItem event={{ id: '5s-2', status: 'running', title: 'Station 4 corrective actions', description: 'Pending tool replacement' }} isLast={false} showTimestamp={true} />
        <TimelineEventItem event={{ id: '5s-3', status: 'pending', title: 'Next audit: Assembly focus', description: 'Target: 80%+ across all zones' }} isLast={true} />
      </Timeline>

      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="5S Audit Checklist v4.2" href="/dashboard/documents/templates" />
          <Source title="July 2026 Audit Report" href="/dashboard/reports/compliance" />
        </SourcesContent>
      </Sources>
    </div>
  );
};
