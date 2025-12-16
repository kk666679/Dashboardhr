'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Brain, FileText, Zap, Settings, Users } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function OrchestratorAgentPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('coordinate');
  const [coordinateData, setCoordinateData] = useState({
    task: '',
    module: '',
    data: '',
    multi_agent: false
  });
  const [lifecycleData, setLifecycleData] = useState({
    employeeData: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/orchestrator-agent');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const coordinateAgents = async () => {
    if (!coordinateData.task.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: coordinateData.task,
          module: coordinateData.module,
          data: JSON.parse(coordinateData.data || '{}'),
          multi_agent: coordinateData.multi_agent
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to coordinate agents:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const orchestrateLifecycle = async () => {
    if (!lifecycleData.employeeData.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'employee_lifecycle',
          module: 'orchestrator-agent',
          data: JSON.parse(lifecycleData.employeeData)
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to orchestrate lifecycle:', error);
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
        <Brain className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold">Orchestrator Agent</h1>
          <p className="text-muted-foreground">AI-powered multi-agent coordination and complex HR task orchestration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
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
          <CardTitle>AI Orchestration Tools</CardTitle>
          <CardDescription>
            Select an orchestration tool to coordinate multiple AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'coordinate' ? 'default' : 'outline'}
              onClick={() => setActiveTab('coordinate')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Multi-Agent Coordination
            </Button>
            <Button
              variant={activeTab === 'lifecycle' ? 'default' : 'outline'}
              onClick={() => setActiveTab('lifecycle')}
            >
              <Users className="h-4 w-4 mr-2" />
              Employee Lifecycle
            </Button>
          </div>

          {activeTab === 'coordinate' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Task (e.g., predict_attrition_risk)"
                  value={coordinateData.task}
                  onChange={(e) => setCoordinateData({...coordinateData, task: e.target.value})}
                />
                <Input
                  placeholder="Module (e.g., hr-analytics)"
                  value={coordinateData.module}
                  onChange={(e) => setCoordinateData({...coordinateData, module: e.target.value})}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="multi_agent"
                    checked={coordinateData.multi_agent}
                    onChange={(e) => setCoordinateData({...coordinateData, multi_agent: e.target.checked})}
                  />
                  <label htmlFor="multi_agent" className="text-sm">Multi-Agent Mode</label>
                </div>
                <Textarea
                  placeholder="Data (JSON format)"
                  value={coordinateData.data}
                  onChange={(e) => setCoordinateData({...coordinateData, data: e.target.value})}
                  rows={4}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={coordinateAgents}
                disabled={analyzing || !coordinateData.task.trim()}
              >
                {analyzing ? 'Analyzing...' : 'Coordinate Agents'}
              </Button>
            </div>
          )}

          {activeTab === 'lifecycle' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Employee Data (JSON format)"
                value={lifecycleData.employeeData}
                onChange={(e) => setLifecycleData({...lifecycleData, employeeData: e.target.value})}
                rows={6}
              />
              <Button
                onClick={orchestrateLifecycle}
                disabled={analyzing || !lifecycleData.employeeData.trim()}
              >
                {analyzing ? 'Orchestrating...' : 'Orchestrate Lifecycle'}
              </Button>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Analysis Result:</h3>
              <pre className="text-sm overflow-x-auto">{JSON.stringify(analysisResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
