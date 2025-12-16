'use client';

import React, { useState } from 'react';
import { AIChat } from '../../../AIChat';
import {
  Code,
  Send,
  Play,
  FileText,
  Zap,
  Shield,
  Brain,
  ChevronRight,
  Copy,
  Download,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const apiEndpoints = [
  {
    method: 'GET',
    path: '/ai-agent-coordinator/industrial-relations',
    description: 'Get Industrial Relations AI Agent features and compliance',
    response: {
      features: ['Dispute prediction', 'Strike risk analysis', 'Agreement compliance'],
      compliance: ['Industrial Relations Act 1967', 'Trade Union Act 1959']
    }
  },
  {
    method: 'GET',
    path: '/ai-agent-coordinator/employee-relations',
    description: 'Get Employee Relations AI Agent capabilities',
    response: {
      features: ['Emotion detection', 'Conflict mediation', 'Culture health'],
      compliance: ['Employment Act 1955', 'PDPA 2010']
    }
  },
  {
    method: 'POST',
    path: '/ai-agent-coordinator/coordinate',
    description: 'Coordinate multiple AI agents for complex HR tasks',
    request: {
      task: 'string',
      module: 'string',
      data: 'object',
      multi_agent: 'boolean'
    }
  },
  {
    method: 'POST',
    path: '/ai-agent-coordinator/employee-lifecycle',
    description: 'Orchestrate AI agents for complete employee lifecycle',
    request: {
      employeeData: 'object'
    }
  },
  {
    method: 'POST',
    path: '/ai-agent-coordinator/compliance-audit',
    description: 'Multi-agent compliance audit orchestration',
    request: {
      auditData: 'object'
    }
  }
];

const sampleRequests = [
  {
    name: 'Analyze Employee Turnover',
    method: 'POST',
    endpoint: '/ai-agent-coordinator/coordinate',
    body: {
      task: 'predict_attrition_risk',
      module: 'hr-analytics',
      data: {
        employee_id: 'EMP001',
        tenure_months: 24,
        performance_score: 85,
        engagement_score: 78,
        compensation_satisfaction: 82,
        recent_events: ['Promotion', 'Training completed'],
        peer_comparison: { avg_performance: 80, avg_engagement: 75 }
      },
      multi_agent: false
    }
  },
  {
    name: 'Compliance Audit',
    method: 'POST',
    endpoint: '/ai-agent-coordinator/compliance-audit',
    body: {
      auditData: {
        organization_size: 150,
        industry: 'Manufacturing',
        recent_audits: [
          { type: 'EPF Compliance', date: '2024-01-01', status: 'Passed' },
          { type: 'PDPA Audit', date: '2023-12-15', status: 'Minor Issues' }
        ],
        regulatory_changes: ['New PDPA guidelines', 'Updated EPF contribution rates'],
        compliance_areas: ['Employment Act', 'PDPA', 'EPF/SOCSO', 'Zakat']
      }
    }
  },
  {
    name: 'Employee Lifecycle Orchestration',
    method: 'POST',
    endpoint: '/ai-agent-coordinator/employee-lifecycle',
    body: {
      employeeData: {
        employee_id: 'EMP001',
        position: 'Software Engineer',
        department: 'IT',
        nationality: 'Malaysian',
        join_date: '2024-01-15',
        salary: 5000,
        location: 'Kuala Lumpur'
      }
    }
  }
];

export default function APIAgentPage() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleExecuteRequest = async (request: any) => {
    setSelectedRequest(request);
    setIsLoading(true);
    setResponse(null);

    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        success: true,
        response: {
          message: 'AI agent coordination completed successfully',
          compliance_notes: ['Malaysian labor laws verified', 'PDPA compliance maintained'],
          confidence_score: 0.92,
          orchestration_metadata: {
            primary_agent: 'hr-analytics',
            coordination_timestamp: new Date().toISOString(),
            malaysian_compliance_verified: true,
            multi_agent_capable: true
          }
        },
        timestamp: new Date().toISOString()
      };
      setResponse(mockResponse);
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (showChat) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b-2 border-purple-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">API Agent Chat</h1>
                <p className="text-sm text-gray-600">Interactive API testing and documentation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Connected
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="flex-1">
          <AIChat />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Code className="w-7 h-7 text-white" />
                </div>
                AI Agent API Hub
              </h1>
              <p className="text-gray-600 mt-2">
                RESTful API endpoints for AI agent coordination and Malaysian HR automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                AI Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* API Endpoints */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">API Endpoints</h2>
          </div>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, idx) => (
              <div key={idx} className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    endpoint.method === 'GET'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <div className="flex-1">
                    <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                    <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>

                    {endpoint.request && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Request Body</h4>
                        <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
                          {JSON.stringify(endpoint.request, null, 2)}
                        </pre>
                      </div>
                    )}

                    {endpoint.response && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Sample Response</h4>
                        <pre className="text-xs bg-green-50 p-3 rounded border overflow-x-auto">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(endpoint.path)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Copy endpoint"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Requests */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sample Requests</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleRequests.map((request, idx) => (
              <div key={idx} className="border-2 border-gray-100 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">{request.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    request.method === 'POST'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {request.method}
                  </span>
                  <code className="text-xs font-mono text-gray-600">{request.endpoint}</code>
                </div>
                <button
                  onClick={() => handleExecuteRequest(request)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Execute
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Response Panel */}
        {(selectedRequest || isLoading) && (
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">API Response</h2>
              {isLoading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
            </div>

            {selectedRequest && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Request: {selectedRequest.name}</h3>
                <div className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedRequest.method === 'POST'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {selectedRequest.method}
                    </span>
                    <code className="font-mono">{selectedRequest.endpoint}</code>
                  </div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(selectedRequest.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-blue-700">Processing AI agent coordination...</span>
              </div>
            )}

            {response && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-semibold">Success</span>
                  <span className="text-sm text-gray-500">({response.timestamp})</span>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Response Data</h4>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(response.response, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Response
                  </button>
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Documentation */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete API Documentation</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Access comprehensive API documentation with authentication, rate limits, error handling,
              and integration examples for Malaysian HR systems.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <FileText className="w-5 h-5" />
                View Full Docs
              </button>
              <button className="bg-white border-2 border-indigo-200 text-indigo-700 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download SDK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
