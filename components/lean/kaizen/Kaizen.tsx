import { useState } from 'react'
import { Lightbulb, ThumbsUp, Trophy, Sparkles, Plus, Filter, Clock, DollarSign, ArrowUpRight, Star, Users, CheckCircle2, Circle, Zap, FileText } from 'lucide-react'
import { Suggestion, Suggestions, Reasoning, ReasoningTrigger, ReasoningContent } from '../../ai-elements'
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton, ConversationTypingIndicator, ConversationHeader } from '../../ai-elements'
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactDescription, ArtifactContent, ArtifactActions, ArtifactAction, ArtifactClose } from '../../ai-elements'

type IdeaStatus = 'submitted' | 'review' | 'approved' | 'implementing' | 'completed'

interface KaizenIdea {
  id: string
  title: string
  submitter: string
  department: string
  status: IdeaStatus
  category: string
  impact: number
  effort: number
  savings: number
  votes: number
  date: string
  description: string
  aiScore: number
}

const ideas: KaizenIdea[] = [
  { id: 'K-047', title: 'Shadow board for Press tools', submitter: 'Aiko Tanaka', department: 'Line B', status: 'approved', category: '5S', impact: 4, effort: 2, savings: 28000, votes: 24, date: 'Jul 14', description: 'Install color-coded shadow boards at each press station to eliminate tool search time (~8 min/shift)', aiScore: 91 },
  { id: 'K-048', title: 'Automated coil splicing alarm', submitter: 'James Okafor', department: 'Line A', status: 'implementing', category: 'Automation', impact: 5, effort: 3, savings: 64000, votes: 37, date: 'Jul 12', description: 'Add audio-visual alarm 60 seconds before coil runs out — removes the 22-minute wait waste event', aiScore: 96 },
  { id: 'K-049', title: 'Kanban cards for consumables', submitter: 'Maria Santos', department: 'Maintenance', status: 'review', category: 'Kanban', impact: 3, effort: 1, savings: 18000, votes: 16, date: 'Jul 18', description: 'Two-bin kanban for lubricants and cutting tools. Eliminates 3 daily trips to central stores.', aiScore: 78 },
  { id: 'K-050', title: 'Visual andon board upgrade', submitter: 'Liu Wei', department: 'All Lines', status: 'submitted', category: 'Visual Mgmt', impact: 4, effort: 3, savings: 45000, votes: 29, date: 'Jul 20', description: 'Replace legacy andon system with 55" touchscreen showing live OEE, defects, and escalation status', aiScore: 88 },
  { id: 'K-051', title: 'Standardize shift handover', submitter: 'Priya Mehta', department: 'All Lines', status: 'completed', category: 'Standardization', impact: 3, effort: 1, savings: 22000, votes: 41, date: 'Jun 30', description: 'Structured 5-minute handover checklist replacing ad-hoc verbal handover. Reduced lost-info incidents by 67%.', aiScore: 85 },
  { id: 'K-052', title: 'AI-powered visual inspection', submitter: 'Tom Bradley', department: 'QC', status: 'review', category: 'AI/ML', impact: 5, effort: 5, savings: 184000, votes: 52, date: 'Jul 15', description: 'Deploy CV model on Line B QC station — estimated 40% defect catch rate improvement vs manual inspection', aiScore: 98 },
]

const statusConfig: Record<IdeaStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#8b92a9', bg: 'rgba(139,146,169,0.1)' },
  review: { label: 'In Review', color: '#ffaa00', bg: 'rgba(255,170,0,0.1)' },
  approved: { label: 'Approved', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)' },
  implementing: { label: 'Implementing', color: '#7c5cfc', bg: 'rgba(124,92,252,0.1)' },
  completed: { label: 'Completed', color: '#00d68f', bg: 'rgba(0,214,143,0.1)' },
}

const leaderboard = [
  { name: 'Tom Bradley', dept: 'QC', ideas: 8, savings: 228000, badges: ['🏆', '⚡', '🎯'] },
  { name: 'James Okafor', dept: 'Line A', ideas: 6, savings: 142000, badges: ['⚡', '🎯'] },
  { name: 'Priya Mehta', dept: 'All Lines', ideas: 7, savings: 98000, badges: ['🏅', '⚡'] },
  { name: 'Aiko Tanaka', dept: 'Line B', ideas: 5, savings: 76000, badges: ['🏅'] },
  { name: 'Maria Santos', dept: 'Maintenance', ideas: 4, savings: 52000, badges: [] },
]

function ImpactEffortMatrix({ ideas }: { ideas: KaizenIdea[] }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-sm font-semibold mb-4" style={{ color: '#f0f2f7' }}>Impact–Effort Matrix</div>
      <div className="relative" style={{ height: 260 }}>
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px">
          {[
            { label: 'Quick Wins', color: 'rgba(0,214,143,0.04)', border: 'rgba(0,214,143,0.1)' },
            { label: 'Major Projects', color: 'rgba(0,212,255,0.04)', border: 'rgba(0,212,255,0.1)' },
            { label: 'Fill-ins', color: 'rgba(139,146,169,0.04)', border: 'rgba(139,146,169,0.08)' },
            { label: 'Avoid', color: 'rgba(255,77,109,0.04)', border: 'rgba(255,77,109,0.08)' },
          ].map((q, i) => (
            <div key={i} className="rounded-lg flex items-end justify-center pb-1" style={{ background: q.color, border: `1px solid ${q.border}` }}>
              <span className="text-xs" style={{ color: '#4d5468', fontFamily: 'Geist Mono' }}>{q.label}</span>
            </div>
          ))}
        </div>
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs" style={{ color: '#4d5468' }}>Impact →</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs" style={{ color: '#4d5468' }}>← Effort</div>
        {ideas.map((idea) => {
          const x = ((idea.effort - 1) / 4) * 85 + 7
          const y = ((5 - idea.impact) / 4) * 85 + 7
          const color = idea.aiScore > 90 ? '#00d4ff' : idea.aiScore > 80 ? '#7c5cfc' : '#8b92a9'
          return (
            <div
              key={idea.id}
              className="absolute flex items-center justify-center rounded-full text-xs font-bold cursor-pointer transition-transform hover:scale-125"
              style={{ left: `${x}%`, top: `${y}%`, width: 32, height: 32, background: `${color}20`, border: `2px solid ${color}`, color, transform: 'translate(-50%,-50%)', fontFamily: 'Geist Mono', fontSize: 9, zIndex: 10 }}
              title={`${idea.id}: ${idea.title}`}
            >
              {idea.id.split('-')[1]}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Kaizen() {
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all')
  const [showAI, setShowAI] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [conversationMessages, setConversationMessages] = useState<Array<{role: string, content: string}>>([])

  const filtered = filter === 'all' ? ideas : ideas.filter((i) => i.status === filter)
  const totalSavings = ideas.reduce((a, i) => a + i.savings, 0)
  const completedIdeas = ideas.filter((i) => i.status === 'completed').length

  const generateIdeas = () => {
    setShowAI(true)
    setAiLoading(true)
    setAiText('')
    const text = "AI Idea Generator · Based on current waste analysis and process data:\n\n1. Poka-yoke fixture for Press #3 — eliminates 34% of dimensional defects. Est. savings: $62K/yr. Effort: Medium.\n\n2. Automated tool life tracking via RFID — prevents cutting tool overrun. Est. savings: $41K/yr. Effort: Low.\n\n3. Digital work instructions on tablets at each station — reduces setup errors by ~50%. Est. savings: $29K/yr. Effort: Low.\n\n4. Milk run for raw material delivery (every 90 min) — eliminates 3 of 8 waste transportation instances. Est. savings: $38K/yr. Effort: Medium.\n\n5. Cross-training program for Press operators — removes single-point-of-failure risk on 2 specialist operators. Est. savings: $28K/yr. Effort: Low."
    let i = 0
    const interval = setInterval(() => {
      setAiText(text.slice(0, i))
      i += 4
      if (i > text.length) {
        setAiLoading(false)
        clearInterval(interval)
      }
    }, 20)
  }

  // AI suggestion based on current ideas
  const topQuickWin = ideas
    .filter(i => i.impact >= 4 && i.effort <= 2 && i.status !== 'completed')
    .sort((a,b) => b.aiScore - a.aiScore)[0]

  return (
    <div className="p-6 space-y-5">
      {/* AI Conversation Panel */}
      <div className="rounded-xl p-4" style={{ background: '#161820', border: '1px solid rgba(124,92,252,0.2)' }}>
        <Conversation>
          <ConversationContent>
            {conversationMessages.length === 0 ? (
              <ConversationEmptyState title="No messages yet" description="Ask about ideas, categories, or improvement suggestions..." />
            ) : (
              <div className="space-y-3">
                {conversationMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{msg.content}</div>
                  </div>
                ))}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 bg-transparent text-xs outline-none px-2 py-1.5 rounded-lg"
            style={{ background: '#0f1117', color: '#f0f2f7', border: '1px solid rgba(255,255,255,0.06)' }}
            placeholder="Ask about ideas, categories, or improvement suggestions..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                const msg = (e.target as HTMLInputElement).value;
                setConversationMessages([
                  ...conversationMessages,
                  { role: 'user', content: msg },
                  { role: 'assistant', content: `I'll analyze your ideas. Based on current data, the best category to explore is "Automation" with avg impact ${ideas.filter(i=>i.category==='Automation').reduce((a,b)=>a+b.impact,0)/ideas.filter(i=>i.category==='Automation').length}.` }
                ]);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      </div>

      {/* AI Suggestion & Reasoning */}
      {topQuickWin && (
        <div className="grid grid-cols-2 gap-3">
          <Suggestions>
            <Suggestion suggestion={`⭐ Quick Win: ${topQuickWin.title} (Impact ${topQuickWin.impact}, Effort ${topQuickWin.effort})`} />
          </Suggestions>
          <Reasoning>
            <ReasoningTrigger />
            <ReasoningContent>Identified high-impact, low-effort ideas. Filtered by approval status. Prioritized by AI score.</ReasoningContent>
          </Reasoning>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#f0f2f7' }}>Kaizen</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8b92a9' }}>Continuous improvement · Ideas · Recognition</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generateIdeas} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(124,92,252,0.1)', color: '#7c5cfc', border: '1px solid rgba(124,92,252,0.2)' }}>
            <Sparkles size={12} /> AI Ideas
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Plus size={12} /> Submit Idea
          </button>
          {/* New: Generate Report with Artifact */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(0,214,143,0.1)', color: '#00d68f', border: '1px solid rgba(0,214,143,0.2)' }}
            onClick={() => alert('Report generated!')}>
            <FileText size={12} /> Generate Report
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Ideas', value: ideas.length.toString(), color: '#00d4ff' },
          { label: 'Completed', value: completedIdeas.toString(), color: '#00d68f' },
          { label: 'Total Savings', value: `$${(totalSavings / 1000).toFixed(0)}K`, color: '#ffaa00' },
          { label: 'Avg AI Score', value: `${Math.round(ideas.reduce((a, i) => a + i.aiScore, 0) / ideas.length)}`, color: '#7c5cfc' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-1" style={{ color: '#4d5468' }}>{m.label}</div>
            <div className="text-2xl font-bold" style={{ color: m.color, fontFamily: 'Geist Mono' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* AI Ideas panel */}
      {showAI && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.15)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: '#7c5cfc' }} />
            <span className="text-sm font-semibold" style={{ color: '#f0f2f7' }}>AI Idea Generator</span>
            {aiLoading && <span className="text-xs ml-auto" style={{ color: '#7c5cfc', fontFamily: 'Geist Mono' }}>generating<span className="cursor-blink">▋</span></span>}
          </div>
          <pre className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#8b92a9', fontFamily: 'Geist Mono' }}>
            {aiText}{aiLoading && <span className="cursor-blink" style={{ color: '#7c5cfc' }}>▋</span>}
          </pre>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Ideas list */}
        <div className="col-span-2 space-y-3">
          {/* Filter */}
          <div className="flex gap-1 flex-wrap">
            {(['all', 'submitted', 'review', 'approved', 'implementing', 'completed'] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filter === s ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                  color: filter === s ? '#00d4ff' : '#8b92a9',
                  border: `1px solid ${filter === s ? 'rgba(0,212,255,0.2)' : 'transparent'}`,
                }}>
                {s === 'all' ? 'All' : statusConfig[s].label}
              </button>
            ))}
          </div>

          {filtered.map((idea) => {
            const sc = statusConfig[idea.status]
            return (
              <div key={idea.id} className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(0,212,255,0.08)' }}>
                    <Lightbulb size={14} style={{ color: '#00d4ff' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono" style={{ color: '#4d5468', fontFamily: 'Geist Mono' }}>{idea.id}</span>
                      <span className="text-sm font-semibold" style={{ color: '#f0f2f7' }}>{idea.title}</span>
                      <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: '#8b92a9', lineHeight: 1.6 }}>{idea.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4d5468' }}>
                        <Users size={11} />
                        <span>{idea.submitter}</span>
                        <span>·</span>
                        <span>{idea.department}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#00d68f', fontFamily: 'Geist Mono' }}>
                        <DollarSign size={11} />
                        <span>${(idea.savings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#7c5cfc' }}>
                        <Zap size={11} />
                        <span>AI: {idea.aiScore}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: '#8b92a9' }}>
                        <ThumbsUp size={11} />
                        <span>{idea.votes}</span>
                        <span className="ml-2" style={{ color: '#4d5468' }}>{idea.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <ImpactEffortMatrix ideas={ideas} />

          {/* Leaderboard */}
          <div className="rounded-xl p-4" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={14} style={{ color: '#ffaa00' }} />
              <span className="text-sm font-semibold" style={{ color: '#f0f2f7' }}>Leaderboard</span>
            </div>
            <div className="space-y-2">
              {leaderboard.map((person, i) => (
                <div key={person.name} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: i === 0 ? 'rgba(255,170,0,0.06)' : 'transparent' }}>
                  <div className="w-5 text-xs font-bold text-center" style={{ color: i === 0 ? '#ffaa00' : '#4d5468', fontFamily: 'Geist Mono' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: '#f0f2f7' }}>{person.name}</div>
                    <div className="text-xs" style={{ color: '#4d5468' }}>{person.dept} · {person.ideas} ideas</div>
                  </div>
                  <div className="text-xs" style={{ color: '#00d68f', fontFamily: 'Geist Mono' }}>
                    ${(person.savings / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs">{person.badges.join('')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
