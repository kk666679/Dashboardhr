// components/six-sigma/DMAIC.tsx
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  FileText, BarChart2,
  FlaskConical, TrendingUp, Shield, CheckCircle2,
  AlertCircle, Info, ChevronRight, Plus, Download,
} from 'lucide-react'
import { Conversation, ConversationHeader, ConversationContent } from '../ai-elements/conversation'
import { Suggestions, Suggestion } from '../ai-elements/suggestion'
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements/reasoning'
import { ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtStep, ChainOfThoughtContent } from '../ai-elements/chain-of-thought'
import { Agent, AgentHeader, AgentStatusDot, AgentContent, AgentMetrics } from '../ai-elements/agent'
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanFooter, PlanTrigger } from '../ai-elements/plan'
import { Task, TaskTrigger, TaskContent, TaskItem } from '../ai-elements/task'
import { Timeline, TimelineEventItem } from '../ai-elements/timeline'
import { ChartCard } from '../charts/ChartCard'

type DMAICPhase = 'define' | 'measure' | 'analyze' | 'improve' | 'control'

const phases: { id: DMAICPhase; label: string; icon: any; color: string; progress: number }[] = [
  { id: 'define', label: 'Define', icon: FileText, color: '#00d4ff', progress: 100 },
  { id: 'measure', label: 'Measure', icon: BarChart2, color: '#7c5cfc', progress: 85 },
  { id: 'analyze', label: 'Analyze', icon: FlaskConical, color: '#ffaa00', progress: 60 },
  { id: 'improve', label: 'Improve', icon: TrendingUp, color: '#00d68f', progress: 30 },
  { id: 'control', label: 'Control', icon: Shield, color: '#ff4d6d', progress: 5 },
]

const controlChartData = Array.from({ length: 25 }, (_, i) => ({
  sample: i + 1,
  value: 50 + (Math.random() - 0.5) * 8 + (i === 12 ? 6 : 0),
  ucl: 56.2,
  lcl: 43.8,
  cl: 50,
}))

const paretoData = [
  { cause: 'Operator Error', defects: 412, cumPct: 28 },
  { cause: 'Machine Wear', defects: 318, cumPct: 50 },
  { cause: 'Material Defect', defects: 245, cumPct: 66 },
  { cause: 'Setup Error', defects: 189, cumPct: 79 },
  { cause: 'Environment', defects: 132, cumPct: 88 },
  { cause: 'Other', defects: 174, cumPct: 100 },
]

const fishboneCategories = [
  { name: 'Man', causes: ['Untrained operators', 'High turnover', 'Fatigue'] },
  { name: 'Machine', causes: ['Press wear #3', 'Calibration drift', 'Vibration'] },
  { name: 'Method', causes: ['Inconsistent SOP', 'No visual aids', 'Wrong sequence'] },
  { name: 'Material', causes: ['Supplier variance', 'Storage humidity', 'Wrong grade'] },
  { name: 'Measurement', causes: ['Gauge R&R 28%', 'Operator MSA fail', 'Calibration'] },
  { name: 'Environment', causes: ['Temperature swings', 'Dust contamination'] },
]

const sipocData = {
  suppliers: ['Acme Metals Inc', 'Global Polymers', 'FastLogistics Co'],
  inputs: ['Raw aluminum sheet', 'Polymer coating', 'Adhesive compound'],
  process: ['Receive & inspect', 'Cut to spec', 'Press & form', 'Coat', 'QC inspect', 'Pack & ship'],
  outputs: ['Formed parts', 'QC records', 'Reject log'],
  customers: ['Assembly Line A', 'OEM Customer X', 'Distribution Hub'],
}

const P = {
  bg: '#0f1117',
  card: '#161820',
  text: '#f0f2f7',
  sub: '#8b92a9',
  muted: '#4d5468',
  border: 'rgba(255,255,255,0.06)',
  blue: '#00d4ff',
  purple: '#7c5cfc',
  green: '#00d68f',
  amber: '#ffaa00',
  red: '#ff4d6d',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: P.card, border: `1px solid rgba(255,255,255,0.08)`, color: P.text, fontFamily: 'Geist Mono' }}>
      <div style={{ color: P.sub, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || P.text }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</div>
      ))}
    </div>
  )
}

function DefinePhase() {
  const [convMessages, setConvMessages] = useState<Array<{role: string, content: string}>>([])
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: P.card, border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: P.text }}>Define Phase Coach</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(139,146,169,0.1)', color: P.sub, fontFamily: 'Geist Mono' }}>{convMessages.length}</span>
        </div>
        {convMessages.length === 0 && (
          <div className="text-xs py-3" style={{ color: P.muted, textAlign: 'center' }}>Ask about Define phase activities...</div>
        )}
        {convMessages.map((msg, i) => (
          <div key={i} className="flex mb-2" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div className="px-3 py-2 rounded-lg text-xs max-w-[80%]" style={{
              background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(139,146,169,0.1)',
              color: P.text,
              fontFamily: 'Geist Mono',
              border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(139,146,169,0.2)'}`,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <input
          className="w-full bg-transparent text-xs outline-none px-2 py-1.5 rounded-lg mt-2"
          style={{ background: P.bg, color: P.text, fontFamily: 'Geist Mono', border: '1px solid rgba(255,255,255,0.06)' }}
          placeholder="Ask about Define phase activities..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
              setConvMessages([
                ...convMessages,
                { role: 'user', content: (e.target as HTMLInputElement).value },
                { role: 'assistant', content: 'Great question about Define phase. Remember to clearly articulate the problem and link it to customer requirements.' }
              ]);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <div className="mt-2">
          <Suggestions>
            <Suggestion suggestion="Review CTQs with stakeholders" />
            <Suggestion suggestion="Validate VOC data" />
          </Suggestions>
        </div>

        <Plan defaultOpen={true}>
          <PlanHeader>
            <PlanTitle>Project Charter — Line B Defect Reduction</PlanTitle>
            <PlanDescription>Press Section | 5,800 DPMO target to 3,400 DPMO</PlanDescription>
          </PlanHeader>
          <PlanTrigger />
          <PlanContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Project Title', value: 'Line B Defect Reduction — Press Section' },
                { label: 'Champion', value: 'Sarah Chen, VP Operations' },
                { label: 'Master Black Belt', value: 'Marcus Kim' },
                { label: 'Start Date', value: 'March 1, 2026' },
                { label: 'Target Completion', value: 'August 31, 2026' },
                { label: 'Financial Benefit', value: '$480,000 annualized' },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded-lg" style={{ background: P.card }}>
                  <div className="text-xs mb-1" style={{ color: P.muted }}>{f.label}</div>
                  <div className="text-sm font-medium" style={{ color: P.text }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg" style={{ background: P.card }}>
              <div className="text-xs mb-1" style={{ color: P.muted }}>Problem Statement</div>
              <div className="text-sm" style={{ color: P.sub, lineHeight: 1.6 }}>
                Line B press section is producing 5,800 DPMO against a target of 3,400 DPMO. Defect types are primarily dimensional non-conformances (42%) and surface finish failures (31%). This results in $840K annual COPQ and is limiting throughput by an estimated 18%.
              </div>
            </div>
          </PlanContent>
          <PlanFooter>
            <div className="flex justify-between w-full text-xs" style={{ color: P.muted }}>
              <span>Champion: Sarah Chen</span>
              <span>Target: Aug 31, 2026</span>
            </div>
          </PlanFooter>
        </Plan>

        <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
          <div className="text-sm font-semibold mb-4" style={{ color: P.text }}>SIPOC Diagram</div>
          <div className="grid grid-cols-5 gap-2">
            {(['suppliers','inputs','process','outputs','customers'] as const).map((col, i) => {
              const colors = [P.blue, P.purple, P.amber, P.green, P.red]
              return (
                <div key={col}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2 text-center" style={{ color: colors[i], fontFamily: 'Geist Mono' }}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </div>
                  {sipocData[col].map((item, j) => (
                    <div key={j} className="text-xs p-2 rounded-lg mb-1.5 text-center" style={{ background: `${colors[i]}0f`, border: `1px solid ${colors[i]}20`, color: P.text, lineHeight: 1.4 }}>
                      {item}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
          <div className="text-sm font-semibold mb-4" style={{ color: P.text }}>VOC → CTQ Tree</div>
          <div className="space-y-2">
            {[
              { voc: "Parts must fit first time", ctq: "Dimensional tolerance ±0.05mm", metric: "6σ", weight: 'Critical' },
              { voc: "No surface marks on delivery", ctq: "Surface roughness Ra < 0.8μm", metric: "4.5σ", weight: 'High' },
              { voc: "Delivered on time", ctq: "Lead time ≤ 3.5 days", metric: "4.0σ", weight: 'High' },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: P.card }}>
                <div className="flex-1 text-xs" style={{ color: P.sub }}>{row.voc}</div>
                <ChevronRight size={12} style={{ color: P.muted }} />
                <div className="flex-1 text-xs" style={{ color: P.text }}>{row.ctq}</div>
                <ChevronRight size={12} style={{ color: P.muted }} />
                <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,255,0.1)', color: P.blue, fontFamily: 'Geist Mono' }}>{row.metric}</div>
                <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: row.weight === 'Critical' ? 'rgba(255,77,109,0.1)' : 'rgba(255,170,0,0.1)', color: row.weight === 'Critical' ? P.red : P.amber }}>{row.weight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MeasurePhase() {
  return (
    <div className="space-y-4">
      <Suggestions>
        <Suggestion suggestion="Ensure measurement system is stable before collecting baseline" />
        <Suggestion suggestion="Conduct Gauge R&R study" />
      </Suggestions>

      <ChartCard title="Process Capability Metrics" description="Current baseline measurements for Press #3" kpi="5,800 DPMO" trend="down" trendLabel="Target: 3,400 DPMO" aiInsight="AI recommends MSA study first">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Units', value: '847,320', color: P.blue },
            { label: 'Total Defects', value: '4,914', color: P.red },
            { label: 'DPMO', value: '5,800', color: P.amber },
            { label: 'Process Sigma', value: '4.1σ', color: P.purple },
            { label: 'Yield', value: '99.42%', color: P.green },
            { label: 'Cp', value: '1.38', color: P.blue },
          ].map((m) => (
            <div key={m.label} className="rounded-xl p-4" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
              <div className="text-xs mb-1" style={{ color: P.muted }}>{m.label}</div>
              <div className="text-xl font-bold" style={{ color: m.color, fontFamily: 'Geist Mono' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <Agent>
        <AgentHeader name="Measurement System Analyst" model="gpt-4o" status="done" actions={<span className="flex items-center gap-1 text-xs" style={{ color: P.green }}><AgentStatusDot status="done" />Analysis complete</span>} />
        <AgentContent>
          <AgentMetrics metrics={[
            { label: 'Samples Analyzed', value: '847,320' },
            { label: 'GR&R Status', value: '27.8%' },
            { label: 'Data Points', value: '25' },
            { label: 'Confidence', value: '95%' },
          ]} />
        </AgentContent>
      </Agent>

      <ChartCard title="X-Bar Control Chart" description="Press #3 — 25 samples" kpi="1 OOC Point" trend="down" trendLabel="Needs investigation" aiInsight="AI detected pattern at sample 13">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={controlChartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis dataKey="sample" tick={{ fill: P.muted, fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: P.muted, fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} domain={[40, 62]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={56.2} stroke={P.red} strokeDasharray="4 4" label={{ value: 'UCL', fill: P.red, fontSize: 10, fontFamily: 'Geist Mono' }} />
            <ReferenceLine y={50} stroke={P.sub} strokeDasharray="2 2" />
            <ReferenceLine y={43.8} stroke={P.red} strokeDasharray="4 4" label={{ value: 'LCL', fill: P.red, fontSize: 10, fontFamily: 'Geist Mono' }} />
            <Line type="monotone" dataKey="value" stroke={P.blue} strokeWidth={1.5} dot={(props: any) => {
              const isOOC = props.value > 56.2 || props.value < 43.8
              return <circle key={props.index} cx={props.cx} cy={props.cy} r={isOOC ? 5 : 3} fill={isOOC ? P.red : P.blue} />
            }} name="Value" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <div className="text-sm font-semibold mb-4" style={{ color: P.text }}>Gauge R&R Summary</div>
        <div className="space-y-3">
          {[
            { component: 'Repeatability (Equipment)', pct: 18.2, status: 'acceptable' },
            { component: 'Reproducibility (Operator)', pct: 9.6, status: 'acceptable' },
            { component: 'Total Gauge R&R', pct: 27.8, status: 'marginal' },
            { component: 'Part-to-Part Variation', pct: 72.2, status: 'good' },
          ].map((r) => (
            <div key={r.component}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: P.sub }}>{r.component}</span>
                <span style={{ color: r.status === 'good' ? P.green : r.status === 'acceptable' ? P.blue : P.amber, fontFamily: 'Geist Mono' }}>{r.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.status === 'good' ? P.green : r.status === 'acceptable' ? P.blue : P.amber }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(255,170,0,0.08)', border: '1px solid rgba(255,170,0,0.15)' }}>
          <Info size={12} style={{ color: P.amber }} />
          <span className="text-xs" style={{ color: P.amber }}>Total GR&R at 27.8% — improvement recommended before capability study</span>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <div className="text-sm font-semibold mb-4" style={{ color: P.text }}>Data Collection Timeline</div>
        <Timeline>
          <TimelineEventItem event={{ id: 'm1', status: 'completed', title: 'Define measurement plan', description: 'Sampling strategy defined' }} isLast={false} />
          <TimelineEventItem event={{ id: 'm2', status: 'completed', title: 'Gauge R&R study', description: '3 operators, 10 parts' }} isLast={false} />
          <TimelineEventItem event={{ id: 'm3', status: 'running', title: 'Baseline data collection', description: '25 samples, ongoing' }} isLast={false} />
          <TimelineEventItem event={{ id: 'm4', status: 'pending', title: 'Capability analysis', description: 'Target: Cp > 1.33' }} isLast={true} />
        </Timeline>
      </div>
    </div>
  )
}

function AnalyzePhase() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Suggestions>
          <Suggestion suggestion="Top cause: Operator Error (28% of defects)" />
          <Suggestion suggestion="Consider 5-Why analysis on Machine Wear" />
        </Suggestions>
        <Reasoning defaultOpen={true}>
          <ReasoningTrigger />
          <ReasoningContent>Pareto shows 50% from top 2 causes. Fishbone indicates multiple contributing factors across Man, Machine, and Method categories.</ReasoningContent>
        </Reasoning>
      </div>

      <ChartCard title="Pareto Analysis" description="Root Cause Defect Distribution" kpi="50%" trend="up" trendLabel="Top 2 causes" aiInsight="Focus on Operator Error + Machine Wear">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={paretoData}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis dataKey="cause" tick={{ fill: P.muted, fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: P.muted, fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: P.muted, fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="defects" fill={P.purple} radius={[3, 3, 0, 0]} name="Defects" />
            <Line yAxisId="right" type="monotone" dataKey="cumPct" stroke={P.amber} strokeWidth={2} dot={{ fill: P.amber, r: 3 }} name="Cum%" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 p-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(0,212,255,0.06)' }}>
          <CheckCircle2 size={12} style={{ color: P.blue }} />
          <span className="text-xs" style={{ color: P.blue }}>Top 2 causes (Operator Error + Machine Wear) account for 50% of defects — prioritize corrective actions here</span>
        </div>
      </ChartCard>

      <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <div className="text-sm font-semibold mb-4" style={{ color: P.text }}>Fishbone Diagram — Ishikawa</div>
        <div className="text-center p-3 rounded-lg mb-4 text-sm font-semibold" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: P.red }}>
          Effect: High Dimensional Non-Conformances on Press #3
        </div>
        <div className="grid grid-cols-3 gap-3">
          {fishboneCategories.map((cat, i) => {
            const colors = [P.blue, P.purple, P.amber, P.green, P.red, P.sub]
            return (
              <div key={cat.name} className="p-3 rounded-lg" style={{ background: P.card, border: `1px solid ${colors[i]}20` }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: colors[i], fontFamily: 'Geist Mono' }}>{cat.name}</div>
                {cat.causes.map((c, j) => (
                  <div key={j} className="flex items-center gap-1.5 text-xs py-0.5" style={{ color: P.sub }}>
                    <span style={{ color: colors[i] }}>›</span> {c}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <div className="text-sm font-semibold mb-4" style={{ color: P.text }}>5 Why Analysis</div>
        <ChainOfThought defaultOpen={true}>
          <ChainOfThoughtHeader />
          <ChainOfThoughtContent>
            <ChainOfThoughtStep status="complete" label="Why are parts out of dimensional spec?" description="Press #3 force is inconsistent between cycles" />
            <ChainOfThoughtStep status="complete" label="Why is press force inconsistent?" description="Hydraulic cylinder seal is partially worn" />
            <ChainOfThoughtStep status="complete" label="Why wasn't the seal replaced proactively?" description="PM schedule is based on time, not condition" />
            <ChainOfThoughtStep status="complete" label="Why is PM not condition-based?" description="No IoT sensors installed on hydraulic systems" />
            <ChainOfThoughtStep status="complete" label="Why are there no sensors?" description="Capital budget request not submitted in 2024 planning cycle" />
            <ChainOfThoughtStep status="active" label="Root cause identified" description="Budget planning gap — Install IoT sensors for CBM" />
          </ChainOfThoughtContent>
        </ChainOfThought>
      </div>
    </div>
  )
}

function ImproveControlPhase({ phase }: { phase: DMAICPhase }) {
  const isImprove = phase === 'improve'

  const improvementPlanSteps = isImprove ? [
    'Install IoT sensors on Press #3 for condition-based monitoring',
    'Run DOE to optimize press parameters (temperature, pressure, speed)',
    'Implement Poka-Yoke fixture for dimensional checks',
    'Train operators on new SOP and visual inspection protocol',
  ] : [
    'Deploy SPC monitoring dashboard for Press #3',
    'Establish control limits and reaction plan',
    'Conduct monthly audit of control plan adherence',
    'Document standard work for all press operations',
  ]

  return (
    <div className="space-y-4">
      <Agent>
        <AgentHeader
          name={isImprove ? 'Improvement Simulation Agent' : 'Control Plan Agent'}
          model="gpt-4o"
          status={isImprove ? 'streaming' : 'idle'}
          actions={<span className="flex items-center gap-1 text-xs" style={{ color: isImprove ? P.blue : P.sub }}>
            <AgentStatusDot status={isImprove ? 'streaming' : 'idle'} />
            {isImprove ? 'Simulating...' : 'Ready'}
          </span>}
        />
        <AgentContent>
          <AgentMetrics metrics={isImprove ? [
            { label: 'Scenarios', value: '3' },
            { label: 'Expected Gain', value: '+42%' },
            { label: 'Confidence', value: '87%' },
            { label: 'Risk Level', value: 'Low' },
          ] : [
            { label: 'Control Points', value: '12' },
            { label: 'Monitoring Freq', value: 'Hourly' },
            { label: 'Alert Threshold', value: '3σ' },
            { label: 'Audit Score', value: '94%' },
          ]} />
        </AgentContent>
      </Agent>

      <Plan defaultOpen={true}>
        <PlanHeader>
          <PlanTitle>{isImprove ? 'Improvement Action Plan' : 'Control Plan Setup'}</PlanTitle>
          <PlanDescription>{isImprove ? '3 pilot improvements scheduled for Lines A–B' : 'SPC monitoring setup after tollgate approval'}</PlanDescription>
        </PlanHeader>
        <PlanTrigger />
        <PlanContent>
          <Task defaultOpen={true}>
            <TaskTrigger title={`${isImprove ? 'Improvement' : 'Control'} tasks`} />
            <TaskContent>
              {improvementPlanSteps.map((step, i) => (
                <TaskItem key={i}>{i + 1}. {step}</TaskItem>
              ))}
            </TaskContent>
          </Task>
        </PlanContent>
        <PlanFooter>
          <div className="flex justify-between w-full text-xs" style={{ color: P.muted }}>
            <span>{isImprove ? '3 solutions in progress' : '5 control items to implement'}</span>
            <button className="flex items-center gap-1.5" style={{ color: isImprove ? P.green : P.red }}>
              <Plus size={12} />
              {isImprove ? 'Add Solution' : 'Create Control Plan'}
            </button>
          </div>
        </PlanFooter>
      </Plan>

      <Reasoning defaultOpen={false}>
        <ReasoningTrigger />
        <ReasoningContent>
          {isImprove
            ? 'Solution ranking and DOE planning underway. 3 pilot improvements scheduled for Lines A-B starting August 2026. Primary focus: IoT sensor installation for condition-based maintenance trigger.'
            : 'Control plans and SPC monitoring setup will begin after successful pilot completion and tollgate approval. Establish reaction plan for out-of-control conditions.'}
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}

export default function SixSigma() {
  const [activePhase, setActivePhase] = useState<DMAICPhase>('define')
  const [coachMessages, setCoachMessages] = useState<Array<{role: string, content: string}>>([])

  const renderPhase = () => {
    switch (activePhase) {
      case 'define': return <DefinePhase />
      case 'measure': return <MeasurePhase />
      case 'analyze': return <AnalyzePhase />
      case 'improve': return <ImproveControlPhase phase="improve" />
      case 'control': return <ImproveControlPhase phase="control" />
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="rounded-xl p-4" style={{ background: P.card, border: '1px solid rgba(124,92,252,0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: P.text }}>DMAIC Coach — {activePhase} Phase</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(139,146,169,0.1)', color: P.sub, fontFamily: 'Geist Mono' }}>{coachMessages.length}</span>
        </div>
        {coachMessages.length === 0 && (
          <div className="text-xs py-3" style={{ color: P.muted, textAlign: 'center' }}>Ask for advice on DMAIC methodology...</div>
        )}
        {coachMessages.map((msg, i) => (
          <div key={i} className="flex mb-2" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div className="px-3 py-2 rounded-lg text-xs max-w-[80%]" style={{
              background: msg.role === 'user' ? 'rgba(124,92,252,0.1)' : 'rgba(139,146,169,0.1)',
              color: P.text,
              fontFamily: 'Geist Mono',
              border: `1px solid ${msg.role === 'user' ? 'rgba(124,92,252,0.2)' : 'rgba(139,146,169,0.2)'}`,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <input
          className="w-full bg-transparent text-xs outline-none px-2 py-1.5 rounded-lg mt-2"
          style={{ background: P.bg, color: P.text, fontFamily: 'Geist Mono', border: '1px solid rgba(255,255,255,0.06)' }}
          placeholder="Ask for advice on DMAIC methodology..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
              const msg = (e.target as HTMLInputElement).value
              setCoachMessages([
                ...coachMessages,
                { role: 'user', content: msg },
                { role: 'assistant', content: `Let me guide you through the ${activePhase} phase. What would you like to know?` }
              ])
              ;(e.target as HTMLInputElement).value = ''
            }
          }}
        />
        <div className="mt-2">
          <Suggestions>
            <Suggestion suggestion={`In ${activePhase} phase, focus on ${activePhase === 'define' ? 'problem statement and CTQs' : activePhase === 'measure' ? 'data collection and MSA' : activePhase === 'analyze' ? 'root cause identification' : activePhase === 'improve' ? 'solution design and piloting' : 'control plan and monitoring'}`} />
          </Suggestions>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: P.text }}>Six Sigma — DMAIC</h1>
          <p className="text-sm mt-0.5" style={{ color: P.sub }}>Line B Defect Reduction · Project #LSS-2026-047</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(0,212,255,0.1)', color: P.blue, border: '1px solid rgba(0,212,255,0.2)' }}>
          <Plus size={12} /> New Project
        </button>
      </div>

      <div className="flex gap-2">
        {phases.map((phase) => {
          const Icon = phase.icon
          const isActive = activePhase === phase.id
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className="flex-1 p-3 rounded-xl text-left transition-all duration-150"
              style={{
                background: isActive ? `${phase.color}10` : P.bg,
                border: `1px solid ${isActive ? phase.color + '30' : P.border}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: isActive ? phase.color : P.muted }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: isActive ? phase.color : P.sub, fontFamily: 'Geist Mono' }}>
                  {phase.label}
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${phase.progress}%`, background: phase.color }} />
              </div>
              <div className="text-xs mt-1" style={{ color: P.muted, fontFamily: 'Geist Mono' }}>
                {phase.progress}%
              </div>
            </button>
          )
        })}
      </div>

      {renderPhase()}
    </div>
  )
}