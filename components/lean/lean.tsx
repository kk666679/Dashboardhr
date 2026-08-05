import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, Zap, TrendingDown, AlertTriangle, CheckCircle2, Eye, Package, Move, Cog, RotateCcw, Search, ArrowRight, Bot, Sparkles, Brain, Lightbulb } from 'lucide-react'
import { Conversation, ConversationContent, ConversationHeader } from '../ai-elements/conversation'
import { Suggestion, Suggestions } from '../ai-elements/suggestion'
import { Reasoning, ReasoningTrigger, ReasoningContent } from '../ai-elements/reasoning'
import { Agent, AgentHeader, AgentStatusDot } from '../ai-elements/agent'
import { ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtStep, ChainOfThoughtContent } from '../ai-elements/chain-of-thought'
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanTrigger, PlanContent, PlanFooter } from '../ai-elements/plan'
import { ChartCard } from '../charts/ChartCard'

type LeanTab = 'wastes' | 'vsm' | 'takt' | 'oee'

const wastes8 = [
  { name: 'Transportation', acronym: 'T', instances: 47, cost: 82000, severity: 0.72, icon: Move, description: 'Unnecessary movement of materials between stations A3–B1' },
  { name: 'Inventory', acronym: 'I', instances: 23, cost: 145000, severity: 0.88, icon: Package, description: '$145K in WIP inventory piled at Station 4 awaiting inspection' },
  { name: 'Motion', acronym: 'M', instances: 89, cost: 34000, severity: 0.45, icon: Move, description: 'Operators walk avg 1.2km/shift to retrieve tools from central storage' },
  { name: 'Waiting', acronym: 'W', instances: 134, cost: 218000, severity: 0.95, icon: Clock, description: 'Line waits avg 22 min/shift for material replenishment' },
  { name: 'Overproduction', acronym: 'O', instances: 12, cost: 67000, severity: 0.38, icon: TrendingDown, description: 'Line C produces 340 units/shift above actual pull demand' },
  { name: 'Overprocessing', acronym: 'O', instances: 31, cost: 53000, severity: 0.51, icon: Cog, description: 'Secondary coating step adds cost with no customer value' },
  { name: 'Defects', acronym: 'D', instances: 187, cost: 840000, severity: 1.0, icon: AlertTriangle, description: '5,800 DPMO across press section; rework cost $840K COPQ' },
  { name: 'Skills', acronym: 'S', instances: 8, cost: 28000, severity: 0.29, icon: Search, description: 'Specialist knowledge concentrated in 2 operators — bottleneck risk' },
]

const vsmData = [
  { step: 'Receive', va: 12, nva: 45, stock: 480 },
  { step: 'Inspect', va: 8, nva: 18, stock: 240 },
  { step: 'Cut', va: 6, nva: 12, stock: 120 },
  { step: 'Press', va: 4, nva: 22, stock: 360 },
  { step: 'Coat', va: 5, nva: 8, stock: 80 },
  { step: 'QC', va: 3, nva: 14, stock: 200 },
  { step: 'Pack', va: 2, nva: 6, stock: 40 },
  { step: 'Ship', va: 1, nva: 4, stock: 0 },
]

const oeeData = [
  { line: 'Line A', availability: 91, performance: 84, quality: 97, oee: 74 },
  { line: 'Line B', availability: 87, performance: 78, quality: 94, oee: 64 },
  { line: 'Line C', availability: 94, performance: 88, quality: 98, oee: 81 },
  { line: 'Line D', availability: 89, performance: 91, quality: 96, oee: 78 },
]

const taktCalc = {
  availableTime: 450,
  customerDemand: 1440,
  taktTime: 18.75,
  cycleTime: 16.2,
  throughput: 3180,
  headcount: 24,
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#161820', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2f7', fontFamily: 'Geist Mono' }}>
      <div style={{ color: '#8b92a9', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || '#f0f2f7' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

function WasteDashboard() {
  const totalCost = wastes8.reduce((a, w) => a + w.cost, 0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Waste Cost', value: `$${(totalCost / 1000).toFixed(0)}K`, color: '#ff4d6d' },
          { label: 'Waste Instances', value: wastes8.reduce((a, w) => a + w.instances, 0).toString(), color: '#ffaa00' },
          { label: 'Highest Waste', value: 'Defects', color: '#7c5cfc' },
          { label: 'Flow Efficiency', value: '28.4%', color: '#00d4ff' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-1" style={{ color: '#4d5468' }}>{m.label}</div>
            <div className="text-xl font-bold" style={{ color: m.color, fontFamily: 'Geist Mono' }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {wastes8.map((waste) => {
          const Icon = waste.icon
          const severityColor = waste.severity > 0.8 ? '#ff4d6d' : waste.severity > 0.5 ? '#ffaa00' : '#00d68f'
          return (
            <div key={waste.name} className="rounded-xl p-4" style={{ background: '#0f1117', border: `1px solid rgba(255,255,255,0.05)` }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${severityColor}12`, color: severityColor, fontFamily: 'Geist Mono' }}>
                  {waste.acronym}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#f0f2f7' }}>{waste.name}</span>
                    <span className="text-xs" style={{ color: severityColor, fontFamily: 'Geist Mono' }}>
                      ${(waste.cost / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${waste.severity * 100}%`, background: severityColor }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#4d5468' }}>{waste.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ValueStreamMap() {
  const totalVA = vsmData.reduce((a, d) => a + d.va, 0)
  const totalNVA = vsmData.reduce((a, d) => a + d.nva, 0)
  const flowEff = ((totalVA / (totalVA + totalNVA)) * 100).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Value-Added Time', value: `${totalVA} min`, color: '#00d68f' },
          { label: 'Non-Value-Added', value: `${totalNVA} min`, color: '#ff4d6d' },
          { label: 'Flow Efficiency', value: `${flowEff}%`, color: '#00d4ff' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-1" style={{ color: '#4d5468' }}>{m.label}</div>
            <div className="text-xl font-bold" style={{ color: m.color, fontFamily: 'Geist Mono' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* VSM Chart */}
      <div className="rounded-xl p-5" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: '#f0f2f7' }}>Value Stream Map — Process Steps</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={vsmData} barGap={2}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis dataKey="step" tick={{ fill: '#4d5468', fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4d5468', fontSize: 10, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="va" name="Value-Added (min)" fill="#00d68f" radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="nva" name="Non-Value-Added (min)" fill="#ff4d6d" radius={[3, 3, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Flow timeline */}
      <div className="rounded-xl p-5" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: '#f0f2f7' }}>Process Flow Timeline</div>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {vsmData.map((step, i) => (
            <div key={step.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium px-3 py-2 rounded-lg text-center whitespace-nowrap" style={{ background: '#161820', border: '1px solid rgba(255,255,255,0.06)', color: '#f0f2f7', minWidth: 72 }}>
                  <div>{step.step}</div>
                  <div className="mt-1 text-xs" style={{ color: '#00d68f', fontFamily: 'Geist Mono' }}>{step.va}m VA</div>
                  <div className="text-xs" style={{ color: '#ff4d6d', fontFamily: 'Geist Mono' }}>{step.nva}m NVA</div>
                </div>
                {step.stock > 0 && (
                  <div className="text-xs mt-1" style={{ color: '#4d5468', fontFamily: 'Geist Mono' }}>
                    ▽{step.stock}
                  </div>
                )}
              </div>
              {i < vsmData.length - 1 && <ArrowRight size={14} className="mx-1 shrink-0" style={{ color: '#4d5468' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TaktTime() {
  const isHealthy = taktCalc.cycleTime < taktCalc.taktTime
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Available Time', value: `${taktCalc.availableTime} min/shift`, color: '#7c5cfc' },
          { label: 'Customer Demand', value: `${taktCalc.customerDemand} units/day`, color: '#00d4ff' },
          { label: 'Takt Time', value: `${taktCalc.taktTime}s`, color: '#ffaa00' },
          { label: 'Cycle Time', value: `${taktCalc.cycleTime}s`, color: isHealthy ? '#00d68f' : '#ff4d6d' },
          { label: 'Throughput', value: `${taktCalc.throughput} units/shift`, color: '#00d4ff' },
          { label: 'Headcount', value: `${taktCalc.headcount} operators`, color: '#8b92a9' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-1" style={{ color: '#4d5468' }}>{m.label}</div>
            <div className="text-xl font-bold" style={{ color: m.color, fontFamily: 'Geist Mono' }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-5" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: '#f0f2f7' }}>Takt vs Cycle Time Analysis</div>
        <div className="flex items-center gap-8 justify-center py-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold" style={{ color: '#ffaa00', fontFamily: 'Geist Mono' }}>{taktCalc.taktTime}s</div>
            <div className="text-sm" style={{ color: '#8b92a9' }}>Takt Time</div>
            <div className="text-xs" style={{ color: '#4d5468' }}>Customer Pulse</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl" style={{ color: isHealthy ? '#00d68f' : '#ff4d6d' }}>
              {isHealthy ? '✓' : '✗'}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold" style={{ color: isHealthy ? '#00d68f' : '#ff4d6d', fontFamily: 'Geist Mono' }}>{taktCalc.cycleTime}s</div>
            <div className="text-sm" style={{ color: '#8b92a9' }}>Cycle Time</div>
            <div className="text-xs" style={{ color: '#4d5468' }}>Process Speed</div>
          </div>
        </div>
        <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: isHealthy ? 'rgba(0,214,143,0.08)' : 'rgba(255,77,109,0.08)', border: `1px solid ${isHealthy ? 'rgba(0,214,143,0.2)' : 'rgba(255,77,109,0.2)'}` }}>
          {isHealthy ? <CheckCircle2 size={14} style={{ color: '#00d68f' }} /> : <AlertTriangle size={14} style={{ color: '#ff4d6d' }} />}
          <span className="text-xs" style={{ color: isHealthy ? '#00d68f' : '#ff4d6d' }}>
            {isHealthy
              ? `Cycle time (${taktCalc.cycleTime}s) is below takt time (${taktCalc.taktTime}s) — process is capable of meeting demand with ${((taktCalc.taktTime - taktCalc.cycleTime) / taktCalc.taktTime * 100).toFixed(1)}% buffer.`
              : `Cycle time exceeds takt — line cannot meet customer demand. Add capacity or reduce waste.`}
          </span>
        </div>
      </div>
    </div>
  )
}

function OEEDashboard() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-5" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: '#f0f2f7' }}>OEE by Production Line</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={oeeData} barGap={4}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis dataKey="line" tick={{ fill: '#4d5468', fontSize: 11, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4d5468', fontSize: 11, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="availability" name="Availability %" fill="#00d4ff" radius={[3, 3, 0, 0]} />
            <Bar dataKey="performance" name="Performance %" fill="#7c5cfc" radius={[3, 3, 0, 0]} />
            <Bar dataKey="quality" name="Quality %" fill="#00d68f" radius={[3, 3, 0, 0]} />
            <Bar dataKey="oee" name="OEE %" fill="#ffaa00" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {oeeData.map((line) => (
          <div key={line.line} className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-sm font-semibold mb-3" style={{ color: '#f0f2f7' }}>{line.line}</div>
            {[
              { label: 'A', value: line.availability, color: '#00d4ff' },
              { label: 'P', value: line.performance, color: '#7c5cfc' },
              { label: 'Q', value: line.quality, color: '#00d68f' },
            ].map((m) => (
              <div key={m.label} className="mb-2">
                <div className="flex justify-between text-xs mb-0.5">
                  <span style={{ color: '#8b92a9' }}>{m.label}</span>
                  <span style={{ color: m.color, fontFamily: 'Geist Mono' }}>{m.value}%</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                </div>
              </div>
            ))}
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-xs" style={{ color: '#4d5468' }}>OEE </span>
              <span className="text-sm font-bold" style={{ color: line.oee >= 75 ? '#00d68f' : '#ffaa00', fontFamily: 'Geist Mono' }}>
                {line.oee}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const tabs: { id: LeanTab; label: string }[] = [
  { id: 'wastes', label: '8 Wastes' },
  { id: 'vsm', label: 'Value Stream Map' },
  { id: 'takt', label: 'Takt & Flow' },
  { id: 'oee', label: 'OEE' },
]

export default function Lean() {
  const [activeTab, setActiveTab] = useState<LeanTab>('wastes')
  const [conversationMessages, setConversationMessages] = useState<Array<{role: string, content: string}>>([])

  // Top waste (Defects) reasoning steps
  const defectReasoningSteps = [
    `Defects account for ${wastes8.find(w => w.name === 'Defects')?.cost.toLocaleString()} COPQ — the highest cost among all 8 wastes`,
    `5,800 DPMO across press section indicates the process is operating at ~4.1σ`,
    'Priority: Implement poka-yoke fixtures on Press #3 to reduce dimensional non-conformances',
    'Expected impact: ~34% defect reduction, $285K annual savings'
  ]

  return (
    <div className="p-6 space-y-5">
      {/* AI Coach Conversation Panel */}
      <div className="rounded-xl p-4" style={{ background: '#161820', border: '1px solid rgba(0,212,255,0.2)' }}>
        <Conversation>
          <ConversationHeader title="Lean AI Coach" messageCount={conversationMessages.length} />
          <ConversationContent>
            {conversationMessages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Bot size={32} style={{ color: '#4d5468' }} className="mx-auto mb-2" />
                  <p className="text-sm" style={{ color: '#8b92a9' }}>Ask me about Lean methodologies, waste analysis, or Kaizen events...</p>
                </div>
              </div>
            ) : (
              conversationMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                  <div className={`px-4 py-2 rounded-xl text-sm max-w-[80%]`}
                    style={{
                      background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(124,92,252,0.1)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(124,92,252,0.2)'}`,
                      color: '#f0f2f7'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </ConversationContent>
        </Conversation>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about Lean methods, waste reduction, or flow optimization..."
            className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
            style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2f7' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                setConversationMessages([
                  ...conversationMessages,
                  { role: 'user', content: e.currentTarget.value.trim() },
                  { role: 'assistant', content: `Great question about "${e.currentTarget.value.trim()}"! In Lean, we focus on eliminating waste (Muda), unevenness (Mura), and overburden (Muri). The current data shows Defects as the highest-cost waste at $840K COPQ. Would you like me to suggest specific countermeasures?` }
                ]);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
            onClick={() => {
              setConversationMessages([
                ...conversationMessages,
                { role: 'user', content: 'What is the biggest waste in our process?' },
                { role: 'assistant', content: 'Based on current data, **Defects** are the most critical waste — $840K COPQ with 5,800 DPMO. The primary driver is dimensional non-conformances on Press #3 (42% of defects). I recommend prioritizing a poka-yoke fixture design for Press #3 to eliminate the root cause.' }
              ]);
            }}
          >
            <Bot size={14} className="inline mr-1.5" />
            Ask AI
          </button>
        </div>
      </div>

      {/* AI Suggestion + Reasoning */}
      <div className="grid grid-cols-2 gap-3">
        <Suggestions>
          <Suggestion suggestion="Top waste: Defects ($840K) — focus on Press #3 poka-yoke" onClick={(s) => {
            setConversationMessages([...conversationMessages, { role: 'user', content: s }, { role: 'assistant', content: 'Great choice! Defects cost $840K annually. Let me suggest a poka-yoke approach for Press #3...' }]);
          }} />
          <Suggestion suggestion="Reduce Waiting waste by 40% with milk run delivery" onClick={(s) => {
            setConversationMessages([...conversationMessages, { role: 'user', content: s }, { role: 'assistant', content: 'A milk-run delivery system every 90 minutes could eliminate 3 of 8 transportation waste instances...' }]);
          }} />
        </Suggestions>
        <Reasoning>
          <ReasoningTrigger getThinkingMessage={() => (
            <span style={{ color: '#00d4ff' }}>Lean waste analysis — Defects priority</span>
          )} />
          <ReasoningContent>
            {defectReasoningSteps.join('\n\n')}
          </ReasoningContent>
        </Reasoning>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f0f2f7' }}>Lean Module</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8b92a9' }}>Waste elimination · Value stream optimization · Flow efficiency</p>
      </div>

      {/* AI Agent for OEE Monitoring */}
      <Agent>
        <AgentHeader
          name="Lean Monitor Agent"
          model="gpt-4o"
          status="streaming"
          actions={
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,214,143,0.1)', color: '#00d68f' }}>
              <Sparkles size={11} />
              Monitoring OEE
            </span>
          }
        />
      </Agent>

      <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#0f1117' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#00d4ff' : '#8b92a9',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'wastes' && <WasteDashboard />}
      {activeTab === 'vsm' && <ValueStreamMap />}
      {activeTab === 'takt' && <TaktTime />}
      {activeTab === 'oee' && <OEEDashboard />}

      {/* Chain of Thought for waste reasoning */}
      <ChainOfThought defaultOpen={false}>
        <ChainOfThoughtHeader>8 Wastes — Severity Analysis Chain of Thought</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {defectReasoningSteps.map((step, i) => (
            <ChainOfThoughtStep
              key={i}
              label={step}
              status={i < 2 ? 'complete' : i === 2 ? 'active' : 'pending'}
            />
          ))}
        </ChainOfThoughtContent>
      </ChainOfThought>
    </div>
  )
}
