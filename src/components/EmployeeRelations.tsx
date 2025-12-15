import React from 'react';
import { Heart, MessageCircle, Shield, TrendingDown, Users, AlertCircle } from 'lucide-react';

export function EmployeeRelations() {
  const cases = [
    {
      id: 'ER-2024-015',
      type: 'Conflict Resolution',
      employee: 'Lee Wei Chen',
      reportedBy: 'Manager - Sales',
      severity: 'Medium',
      status: 'Investigating',
      reportedDate: '2024-05-10',
      sentimentScore: 62,
      conflictRisk: 'Low'
    },
    {
      id: 'ER-2024-016',
      type: 'Grievance',
      employee: 'Muthu Krishnan',
      reportedBy: 'Self-reported',
      severity: 'Low',
      status: 'Action Taken',
      reportedDate: '2024-05-15',
      sentimentScore: 78,
      conflictRisk: 'Very Low'
    },
    {
      id: 'ER-2024-017',
      type: 'Policy Violation',
      employee: 'Confidential',
      reportedBy: 'HR Manager',
      severity: 'High',
      status: 'Under Review',
      reportedDate: '2024-05-18',
      sentimentScore: 35,
      conflictRisk: 'High'
    },
  ];

  const stats = [
    { label: 'Active Cases', value: '8', change: '-2', icon: Shield, color: 'blue' },
    { label: 'Avg Sentiment Score', value: '72%', change: '+5%', icon: Heart, color: 'green' },
    { label: 'Resolution Rate', value: '94%', change: '+3%', icon: TrendingDown, color: 'purple' },
    { label: 'Culture Health', value: '8.4/10', change: '+0.2', icon: Users, color: 'orange' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return 'bg-blue-100 text-blue-800';
      case 'Investigating': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-orange-100 text-orange-800';
      case 'Action Taken': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Employee Relations</h1>
          <p className="text-sm text-gray-500">AI-powered sentiment analysis and conflict mediation</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Report New Case
        </button>
      </div>

      {/* AI Chatbot Banner */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            💬
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">AI Mediation Chatbot Available</h3>
            <p className="text-white/90 text-sm mb-3">
              Our bilingual AI chatbot (BM/English) is ready to assist with conflict mediation and employee support. 
              Current sentiment analysis shows positive workplace culture with 72% average satisfaction.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm">
                Launch Chatbot
              </button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm">
                View Sentiment Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm ${stat.change.startsWith('-') || stat.change.startsWith('+') && parseFloat(stat.change) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Employee Relations Cases</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              All Cases
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Active Only
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              High Severity
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Case ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Employee</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Reported By</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Severity</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Sentiment</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Conflict Risk</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm text-blue-600">{caseItem.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{caseItem.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{caseItem.employee}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{caseItem.reportedBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(caseItem.severity)}`}>
                      {caseItem.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            caseItem.sentimentScore >= 70 ? 'bg-green-500' :
                            caseItem.sentimentScore >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${caseItem.sentimentScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{caseItem.sentimentScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${
                      caseItem.conflictRisk === 'Very Low' ? 'text-green-600' :
                      caseItem.conflictRisk === 'Low' ? 'text-blue-600' :
                      caseItem.conflictRisk === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {caseItem.conflictRisk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{caseItem.reportedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDPA Compliance */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">PDPA Compliance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Data Encryption</span>
              <span className="text-green-600">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Confidentiality</span>
              <span className="text-green-600">✓ Enforced</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Access Controls</span>
              <span className="text-green-600">✓ Secured</span>
            </div>
          </div>
        </div>

        {/* Culture Metrics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-gray-900">Culture Health</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Engagement</span>
              <span className="text-sm text-gray-900">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Satisfaction</span>
              <span className="text-sm text-gray-900">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">DEI Score</span>
              <span className="text-sm text-gray-900">7.8/10</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
              Launch AI Chatbot
            </button>
            <button className="w-full px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
              Run Sentiment Analysis
            </button>
            <button className="w-full px-4 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
              Generate DEI Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
