'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Zap, FileText, Settings, Play, AlertTriangle } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function AutomationAgentPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workflow');
  const [workflowData, setWorkflowData] = useState({
    name: '',
    description: '',
    steps: '',
    triggers: '',
    conditions: ''
  });
  const [automationData, setAutomationData] = useState({
    task: '',
    frequency: '',
    parameters: '',
    notifications: '',
    error_handling: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/automation-agent');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async () => {
    if (!workflowData.name.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'create_workflow',
          module: 'automation-agent',
          data: {
            ...workflowData,
            steps: workflowData.steps.split('\n').map(s => s.trim()).filter(s => s),
            triggers: workflowData.triggers.split(',').map(t => t.trim()),
            conditions: workflowData.conditions.split(',').map(c => c.trim())
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const setupAutomation = async () => {
    if (!automationData.task.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'setup_automation',
          module: 'automation-agent',
          data: {
            ...automationData,
            parameters: JSON.parse(automationData.parameters || '{}'),
            notifications: automationData.notifications.split(',').map(n => n.trim()),
            error_handling: automationData.error_handling.split(',').map(e => e.trim())
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to setup automation:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold">Automation Agent</h1>
          <p className="text-muted-foreground">AI-powered workflow automation and process optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {features?.compliance.map((item, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Automation Tools</CardTitle>
          <CardDescription>
            Select an automation tool to streamline HR processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'workflow' ? 'default' : 'outline'}
              onClick={() => setActiveTab('workflow')}
            >
              <Play className="h-4 w-4 mr-2" />
              Workflow Creation
            </Button>
            <Button
              variant={activeTab === 'automation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('automation')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Task Automation
            </Button>
          </div>

          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Workflow Name"
                  value={workflowData.name}
                  onChange={(e) => setWorkflowData({...workflowData, name: e.target.value})}
                />
                <Input
                  placeholder="Description"
                  value={workflowData.description}
                  onChange={(e) => setWorkflowData({...workflowData, description: e.target.value})}
                />
                <Textarea
                  placeholder="Steps (one per line)"
                  value={workflowData.steps}
                  onChange={(e) => setWorkflowData({...workflowData, steps: e.target.value})}
                  rows={3}
                />
                <Input
                  placeholder="Triggers (comma-separated)"
                  value={workflowData.triggers}
                  onChange={(e) => setWorkflowData({...workflowData, triggers: e.target.value})}
                />
                <Input
                  placeholder="Conditions (comma-separated)"
                  value={workflowData.conditions}
                  onChange={(e) => setWorkflowData({...workflowData, conditions: e.target.value})}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={createWorkflow}
                disabled={analyzing || !workflowData.name.trim()}
                className="w-full"
              >
                {analyzing ? 'Creating...' : 'Create Workflow'}
              </Button>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Task Name"
                  value={automationData.task}
                  onChange={(e) => setAutomationData({...automationData, task: e.target.value})}
                />
                <Input
                  placeholder="Frequency (daily, weekly, monthly)"
                  value={automationData.frequency}
                  onChange={(e) => setAutomationData({...automationData, frequency: e.target.value})}
                />
                <Textarea
                  placeholder="Parameters (JSON format)"
                  value={automationData.parameters}
                  onChange={(e) => setAutomationData({...automationData, parameters: e.target.value})}
                  rows={3}
                />
                <Input
                  placeholder="Notifications (comma-separated emails)"
                  value={automationData.notifications}
                  onChange={(e) => setAutomationData({...automationData, notifications: e.target.value})}
                />
                <Input
                  placeholder="Error Handling (comma-separated)"
                  value={automationData.error_handling}
                  onChange={(e) => setAutomationData({...automationData, error_handling: e.target.value})}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={setupAutomation}
                disabled={analyzing || !automationData.task.trim()}
                className="w-full"
              >
                {analyzing ? 'Setting up...' : 'Setup Automation'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Success:</strong> {analysisResult.success ? 'Yes' : 'No'}</p>
              {analysisResult.response && (
                <div>
                  {analysisResult.response.workflow_id && (
                    <p><strong>Workflow ID:</strong> {analysisResult.response.workflow_id}</p>
                  )}
                  {analysisResult.response.automation_id && (
                    <p><strong>Automation ID:</strong> {analysisResult.response.automation_id}</p>
                  )}
                  {analysisResult.response.status && (
                    <p><strong>Status:</strong> {analysisResult.response.status}</p>
                  )}
                  {analysisResult.response.execution_time && (
                    <p><strong>Execution Time:</strong> {analysisResult.response.execution_time}</p>
                  )}
                  {analysisResult.response.steps_executed && (
                    <div className="mt-2">
                      <strong>Steps Executed:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.steps_executed.map((step: string, idx: number) => (
                          <li key={idx} className="text-sm">{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.optimization_suggestions && (
                    <div className="mt-2">
                      <strong>Optimization Suggestions:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.optimization_suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx} className="text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.error_logs && (
                    <div className="mt-2">
                      <strong>Error Logs:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.error_logs.map((log: string, idx: number) => (
                          <li key={idx} className="text-sm">{log}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {analysisResult.message && (
                <p><strong>Message:</strong> {analysisResult.message}</p>
              )}
              {analysisResult.compliance_notes && (
                <div className="mt-2">
                  <strong>Compliance Notes:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {analysisResult.compliance_notes.map((note: string, idx: number) => (
                      <li key={idx} className="text-sm">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
