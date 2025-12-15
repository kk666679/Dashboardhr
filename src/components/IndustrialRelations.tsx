import React from 'react';
import { Scale, AlertTriangle, TrendingUp, FileText, Calendar } from 'lucide-react';

export function IndustrialRelations() {
  const cases = [
    {
      id: 'IRC-2024-001',
      type: 'Dismissal',
      employee: 'Ahmad bin Abdullah',
      department: 'Operations',
      filedDate: '2024-01-15',
      status: 'Under Review',
      priority: 'High',
      riskScore: 78,
      aiPrediction: 'Likely to settle in mediation'
    },
    {
      id: 'IRC-2024-002',
      type: 'Wage Dispute',
      employee: 'Siti Nurhaliza',
      department: 'Sales',
      filedDate: '2024-02-20',
      status: 'Mediation',
      priority: 'Medium',
      riskScore: 45,
      aiPrediction: 'Favorable outcome expected'
    },
    {
      id: 'IRC-2024-003',
      type: 'Collective Agreement',
      employee: 'Union Representative',
      department: 'Manufacturing',
      filedDate: '2024-03-10',
      status: 'Hearing Scheduled',
      priority: 'Critical',
      riskScore: 92,
      aiPrediction: 'High escalation risk'
    },
  ];

  const stats = [
    { label: 'Active Cases', value: '12', change: '+2', icon: Scale, color: 'blue' },
    { label: 'Strike Risk Score', value: '34%', change: '-8%', icon: AlertTriangle, color: 'orange' },
    { label: 'Resolution Rate', value: '87%', change: '+5%', icon: TrendingUp, color: 'green' },
    { label: 'Avg. Resolution Time', value: '45 days', change: '-10d', icon: Calendar, color: 'purple' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Mediation': return 'bg-blue-100 text-blue-800';
      case 'Hearing Scheduled': return 'bg-red-100 text-red-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Industrial Relations Module</h1>
          <p className="text-sm text-gray-500">AI-powered dispute resolution and compliance tracking</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          File New Case
        </button>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">AI Prediction Engine Active</h3>
            <p className="text-white/90 text-sm mb-3">
              Analyzing 12 active cases with 92% prediction accuracy. Current strike risk is LOW based on sentiment analysis and historical patterns.
            </p>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-white/20 rounded text-sm">Industrial Relations Act 1967 ✓</span>
              <span className="px-3 py-1 bg-white/20 rounded text-sm">Trade Union Act 1959 ✓</span>
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
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Active Industrial Relations Cases</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Case ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Employee</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Department</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Filed Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Priority</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">AI Prediction</th>
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
                  <td className="px-6 py-4 text-sm text-gray-500">{caseItem.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{caseItem.filedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            caseItem.riskScore >= 70 ? 'bg-red-500' :
                            caseItem.riskScore >= 40 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${caseItem.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{caseItem.riskScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{caseItem.aiPrediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Compliance Requirements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Form 34 Documentation</span>
              <span className="text-green-600">✓ Compliant</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Industrial Court Submissions</span>
              <span className="text-green-600">✓ Up to date</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Union Agreement Updates</span>
              <span className="text-yellow-600">⚠ Review needed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Case Documentation</span>
              <span className="text-green-600">✓ Complete</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Case IRC-2024-002 moved to Mediation</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">AI prediction updated for 3 cases</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Strike risk assessment completed</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
