import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Brain,
  Zap,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Mic,
  Paperclip,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  Shield,
  CheckCircle2,
  Loader2,
  Bot,
  User as UserIcon,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reasoning?: string;
  suggestions?: string[];
  widgets?: Widget[];
}

interface Widget {
  type: 'metric' | 'chart' | 'action' | 'insight';
  title: string;
  data: any;
}

const quickActions = [
  { icon: Users, label: 'Employee Stats', query: 'Show me employee statistics and demographics' },
  { icon: Calendar, label: 'Leave Analysis', query: 'Analyze leave patterns and trends' },
  { icon: TrendingUp, label: 'Performance', query: 'Generate performance insights' },
  { icon: AlertCircle, label: 'Compliance', query: 'Check compliance status' },
  { icon: FileText, label: 'Report', query: 'Generate HR report' },
  { icon: BarChart3, label: 'Analytics', query: 'Show key HR analytics' },
];

const sampleWidgets: Widget[] = [
  {
    type: 'metric',
    title: 'Employee Turnover',
    data: { value: '4.2%', trend: 'down', change: '-1.3%' }
  },
  {
    type: 'metric',
    title: 'Average Tenure',
    data: { value: '3.5 years', trend: 'up', change: '+0.8 years' }
  },
  {
    type: 'insight',
    title: 'Key Finding',
    data: { 
      text: 'Employee satisfaction increased by 12% after implementing flexible work hours',
      confidence: 95
    }
  },
  {
    type: 'action',
    title: 'Recommended Actions',
    data: [
      'Schedule quarterly performance reviews',
      'Update employee handbook',
      'Conduct training needs analysis'
    ]
  }
];

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI HR Assistant with advanced natural language processing capabilities. I can help you with employee analytics, compliance checks, leave management, performance insights, and much more. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        'Analyze employee turnover trends',
        'Check compliance status',
        'Generate leave report',
        'Show performance metrics'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [activeReasoning, setActiveReasoning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    // Simulate AI reasoning and response
    const reasoning = `Analyzing query: "${userMessage}"\n\n1. Intent Classification: ${userMessage.toLowerCase().includes('employee') ? 'Employee Management' : 'General Query'}\n2. Entity Extraction: Identified entities and context\n3. Data Retrieval: Accessing HRMS database\n4. Analysis: Processing patterns and trends\n5. Response Generation: Formulating comprehensive answer\n6. Confidence Score: 94%`;

    let content = '';
    let widgets: Widget[] = [];

    if (userMessage.toLowerCase().includes('employee') || userMessage.toLowerCase().includes('stats')) {
      content = `Based on the current HRMS data analysis, here's a comprehensive overview of employee statistics:

**Employee Overview:**
• Total Employees: 156
• Active: 152 (97.4%)
• On Leave: 4 (2.6%)
• New Hires (Last Month): 8
• Turnover Rate: 4.2% (down from 5.5%)

**Department Distribution:**
• Engineering: 45 employees (28.8%)
• Sales & Marketing: 32 employees (20.5%)
• Operations: 28 employees (17.9%)
• Finance: 24 employees (15.4%)
• HR & Admin: 15 employees (9.6%)
• Others: 12 employees (7.7%)

**Key Insights:**
✓ Employee satisfaction improved by 12% this quarter
✓ Average tenure increased to 3.5 years
✓ Productivity metrics up by 8%
✓ Training completion rate at 92%

Would you like me to dive deeper into any specific area?`;

      widgets = sampleWidgets;
    } else if (userMessage.toLowerCase().includes('leave')) {
      content = `Here's a detailed leave management analysis:

**Leave Overview (Current Month):**
• Pending Approvals: 12 requests
• Approved Leaves: 45 requests
• Rejected: 3 requests
• Average Processing Time: 18 hours

**Leave Type Distribution:**
• Annual Leave: 45% (most popular)
• Medical Leave: 28%
• Emergency Leave: 15%
• Maternity/Paternity: 8%
• Unpaid Leave: 4%

**Trends & Patterns:**
📊 Peak leave period: December (year-end holidays)
📊 Lowest utilization: 67% of annual leave quota used
📊 Department with highest leave requests: Engineering

**Recommendations:**
1. Encourage employees to utilize remaining leave days
2. Plan for December coverage in advance
3. Review leave approval workflow for efficiency`;

      widgets = [
        {
          type: 'chart',
          title: 'Leave Trends',
          data: { months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], values: [23, 28, 31, 27, 35, 29] }
        }
      ];
    } else if (userMessage.toLowerCase().includes('performance')) {
      content = `Performance metrics and insights:

**Overall Performance Score: 87.5/100** ⭐

**Performance Distribution:**
• Exceeds Expectations: 32% (50 employees)
• Meets Expectations: 58% (91 employees)
• Needs Improvement: 10% (15 employees)

**Top Performers (This Quarter):**
1. Engineering Team: 92.3 avg score
2. Sales Team: 89.7 avg score
3. Product Team: 88.4 avg score

**Key Performance Indicators:**
✓ Goal Completion Rate: 91%
✓ On-Time Delivery: 94%
✓ Quality Metrics: 88%
✓ Collaboration Score: 86%

**AI Insights:**
🎯 High correlation between training completion and performance scores
🎯 Teams with regular 1-on-1s show 15% better results
🎯 Flexible work arrangements linked to 12% productivity increase`;

      widgets = [
        {
          type: 'metric',
          title: 'Overall Performance',
          data: { value: '87.5', trend: 'up', change: '+5.2' }
        },
        {
          type: 'insight',
          title: 'Top Insight',
          data: { 
            text: 'Teams with bi-weekly feedback sessions outperform by 23%',
            confidence: 92
          }
        }
      ];
    } else if (userMessage.toLowerCase().includes('compliance')) {
      content = `Compliance status report:

**Overall Compliance Score: 96.5%** ✅

**EPF (Employees Provident Fund):**
✓ Status: Compliant
✓ Last Submission: On-time
✓ Next Deadline: 15th December 2024

**SOCSO (Social Security Organization):**
✓ Status: Compliant
✓ Coverage: 100% eligible employees
✓ Last Payment: Processed

**EIS (Employment Insurance System):**
✓ Status: Compliant
✓ Contribution Rate: Accurate
✓ Records: Up-to-date

**Employment Act 1955:**
✓ Working Hours: Compliant
✓ Overtime Records: Maintained
✓ Leave Policies: Aligned
✓ Termination Procedures: Documented

**PCB (Monthly Tax Deductions):**
✓ Status: Compliant
✓ E-Filing: Current
✓ CP8A Forms: Submitted

**Action Items:**
⚠️ 3 employee contracts expiring within 30 days
⚠️ 5 employees due for mandatory health screening
ℹ️ Annual compliance audit recommended for Q1 2025`;

      widgets = [
        {
          type: 'metric',
          title: 'Compliance Score',
          data: { value: '96.5%', trend: 'up', change: '+2.1%' }
        }
      ];
    } else {
      content = `I understand your query: "${userMessage}". 

As an AI assistant powered by advanced NLP, I can help you with:

**Core Capabilities:**
🤖 Natural Language Understanding
📊 Data Analysis & Insights
📈 Predictive Analytics
🎯 Smart Recommendations
🔍 Pattern Recognition
💡 Intelligent Automation

**Available Functions:**
• Employee data analysis
• Leave management insights
• Performance evaluation
• Compliance monitoring
• Payroll analytics
• Turnover prediction
• Recruitment optimization
• Training recommendations

Please let me know what specific information you need, and I'll provide a detailed analysis with actionable insights.`;
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      reasoning,
      widgets,
      suggestions: [
        'Tell me more about this',
        'Show detailed breakdown',
        'Export this data',
        'What are the recommendations?'
      ]
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = simulateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
            <h4 className="text-sm text-gray-600 mb-2">{widget.title}</h4>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">{widget.data.value}</span>
              {widget.data.trend === 'up' ? (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  ↑ {widget.data.change}
                </span>
              ) : (
                <span className="text-red-600 text-sm flex items-center gap-1">
                  ↓ {widget.data.change}
                </span>
              )}
            </div>
          </div>
        );

      case 'insight':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{widget.title}</h4>
                <p className="text-sm text-gray-700 mb-2">{widget.data.text}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${widget.data.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">{widget.data.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              {widget.title}
            </h4>
            <div className="space-y-2">
              {widget.data.map((action: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{action}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-purple-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              AI HR Assistant
            </h1>
            <p className="text-gray-500">
              • Real-time insights •
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                showReasoning
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Brain className="w-4 h-4" />
              Show Reasoning
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b-2 border-purple-100 px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-sm text-gray-600 font-medium mr-2">Quick Actions:</span>
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.query)}
                className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all flex items-center gap-2 text-sm border border-purple-200 whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-purple-600" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : 'bg-white border-2 border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className={`text-sm whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-purple-50 rounded transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                      {message.reasoning && (
                        <button
                          onClick={() => setActiveReasoning(activeReasoning === message.id ? null : message.id)}
                          className="p-1 hover:bg-purple-50 rounded transition-colors"
                          title="Show reasoning"
                        >
                          <Brain className="w-4 h-4 text-purple-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <span className={`text-xs mt-2 block ${message.role === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* Reasoning Panel */}
              {message.role === 'assistant' && message.reasoning && activeReasoning === message.id && showReasoning && (
                <div className="mt-3 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">AI Reasoning Process</h4>
                  </div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white/50 p-3 rounded-lg">
                    {message.reasoning}
                  </pre>
                </div>
              )}

              {/* Widgets */}
              {message.role === 'assistant' && message.widgets && message.widgets.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {message.widgets.map((widget, idx) => (
                    <div key={idx}>{renderWidget(widget)}</div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(suggestion)}
                      className="px-3 py-1.5 bg-white border-2 border-purple-200 hover:border-purple-400 rounded-full text-sm text-gray-700 hover:text-purple-700 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                <span className="text-sm text-gray-600">AI is thinking and analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-purple-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-gray-50 border-2 border-purple-200 rounded-2xl p-3 focus-within:border-purple-400 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about HR, employees, analytics, compliance..."
                className="w-full bg-transparent resize-none outline-none text-gray-900 placeholder-gray-400"
                rows={1}
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
              <div className="flex items-center gap-2 mt-2">
                <button className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors" title="Attach file">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors" title="Voice input">
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
                <div className="flex-1"></div>
                <span className="text-xs text-gray-400">{input.length}/2000</span>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI responses are generated based on HRMS data • Always verify critical information
          </p>
        </div>
      </div>
    </div>
  );
}