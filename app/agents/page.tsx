'use client';

import React, { useState } from 'react';
import { AIChat } from '../../components/AIChat';
import {
  Users,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
  FileText,
  BarChart3,
  Target,
  Lightbulb,
  ChevronRight,
  Play,
  Settings,
  MessageSquare
} from 'lucide-react';

const agents = [
  {
    id: 'industrial-relations',
    name: 'Industrial Relations Agent',
    description: 'Dispute resolution, strike risk assessment, collective agreements',
    icon: AlertCircle,
    color: 'from-red-500 to-orange-500',
    features: [
      'Dispute prediction (92% accuracy)',
      'Strike risk analysis',
      'Agreement compliance',
      'Legal precedent database'
    ],
    compliance: ['Industrial Relations Act 1967', 'Trade Union Act 1959']
  },
  {
    id: 'employee-relations',
    name: 'Employee Relations Agent',
    description: 'Emotion detection, conflict mediation, culture health',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Emotion analysis in feedback',
      'Conflict mediation chatbot',
      'Culture health dashboard',
      'ER case prediction'
    ],
    compliance: ['Employment Act 1955', 'PDPA 2010']
  },
  {
    id: 'foreign-workers',
    name: 'Foreign Workers Agent',
    description: 'Permit renewals, compliance, multi-language support',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Permit renewal predictions',
      'Compliance risk assessment',
      'Multi-language communication',
      'Levy optimization'
    ],
    compliance: ['Immigration Act', 'MOHR regulations', 'FOMEMA']
  },
  {
    id: 'compensation-benefits',
    name: 'Compensation & Benefits Agent',
    description: 'Salary benchmarking, Zakat calculations, pay equity',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Market salary benchmarking',
      'Zakat calculations',
      'Pay equity analysis',
      'Total rewards statements'
    ],
    compliance: ['LHDN certified', 'JAWHAR approved', 'EPF Act 1991']
  },
  {
    id: 'talent-acquisition',
    name: 'Talent Acquisition Agent',
    description: 'Resume parsing, candidate screening, interview analytics',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    features: [
      'AI resume parsing',
      'Candidate screening',
      'Interview bias detection',
      'Quality of hire prediction'
    ],
    compliance: ['PDPA hiring', 'MYWorkID integration']
  },
  {
    id: 'learning-development',
    name: 'Learning & Development Agent',
    description: 'Skills gap analysis, learning paths, training ROI',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Skills gap identification',
      'Personalized learning paths',
      'Training ROI prediction',
      'AR/VR simulations'
    ],
    compliance: ['HRDF requirements', 'Skill Malaysia']
  },
  {
    id: 'performance-management',
    name: 'Performance Management Agent',
    description: 'OKR tracking, feedback analysis, career simulation',
    icon: BarChart3,
    color: 'from-teal-500 to-green-500',
    features: [
      'OKR predictive tracking',
      '360° feedback analysis',
      '9-box grid assessment',
      'Career path simulation'
    ],
    compliance: ['MSC Malaysia standards', 'NKEA KPIs']
  },
  {
    id: 'hr-analytics',
    name: 'HR Analytics Agent',
    description: 'Predictive insights, workforce planning, compliance health',
    icon: Brain,
    color: 'from-gray-500 to-slate-500',
    features: [
      'Attrition risk prediction',
      'Workforce planning',
      'Compliance health assessment',
      'ROI calculations'
    ],
    compliance: ['Bursa Malaysia ESG', 'TalentCorp reporting']
  }
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AI HR Agents</h1>
        <p className="text-lg text-muted-foreground">
          Intelligent automation for every aspect of human resources management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <div
              key={agent.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedAgent(agent.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${agent.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {agent.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Compliance:</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.compliance.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Agent Details</h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const agent = agents.find(a => a.id === selectedAgent);
                if (!agent) return null;

                const IconComponent = agent.icon;
                return (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-lg bg-gradient-to-br ${agent.color} text-white`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{agent.name}</h3>
                        <p className="text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">All Features:</h4>
                      <ul className="space-y-2">
                        {agent.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Compliance Framework:</h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.compliance.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                        onClick={() => window.location.href = `/agents/${agent.id}`}
                      >
                        Access Agent
                      </button>
                      <button
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setSelectedAgent(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
