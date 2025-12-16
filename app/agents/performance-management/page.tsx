'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { BarChart3, Target, MessageSquare, FileText } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function PerformanceManagementPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('okr');
  const [okrData, setOkrData] = useState({
    employee_id: '',
    timeframe: '',
    objective: '',
    key_results: '',
    target_values: '',
    current_values: ''
  });
  const [feedbackData, setFeedbackData] = useState({
    employee_id: '',
    feedback_type: '',
    reviewer_id: '',
    context: '',
    feedback_text: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/performance-management');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackOKRs = async () => {
    if (!okrData.employee_id.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'track_okrs',
          module: 'performance-management',
          data: {
            employee_id: okrData.employee_id,
            timeframe: okrData.timeframe,
            objective: okrData.objective,
            key_results: okrData.key_results.split('\n').map(kr => kr.trim()).filter(kr => kr),
            target_values: okrData.target_values.split(',').map(v => parseFloat(v.trim())),
            current_values: okrData.current_values.split(',').map(v => parseFloat(v.trim()))
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to track OKRs:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeFeedback = async () => {
    if (!feedbackData.employee_id.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'analyze_feedback',
          module: 'performance-management',
          data: {
            employee_id: feedbackData.employee_id,
            feedback_type: feedbackData.feedback_type,
            reviewer_id: feedbackData.reviewer_id,
            context: feedbackData.context,
            feedback_text: feedbackData.feedback_text
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze feedback:', error);
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
        <BarChart3 className="h-8 w-8 text-teal-600" />
        <div>
          <h1 className="text-3xl font-bold">Performance Management Agent</h1>
          <p className="text-muted-foreground">AI-powered OKR tracking, feedback analysis, and performance insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
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
          <CardTitle>AI Analysis Tools</CardTitle>
          <CardDescription>
            Select an analysis tool to process performance management data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'okr' ? 'default' : 'outline'}
              onClick={() => setActiveTab('okr')}
            >
              <Target className="h-4 w-4 mr-2" />
              OKR Tracking
            </Button>
            <Button
              variant={activeTab === 'feedback' ? 'default' : 'outline'}
              onClick={() => setActiveTab('feedback')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback Analysis
            </Button>
          </div>

          {activeTab === 'okr' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Employee ID"
                  value={okrData.employee_id}
                  onChange={(e) => setOkrData({...okrData, employee_id: e.target.value})}
                />
                <Input
                  placeholder="Timeframe (e.g., Q1 2024)"
                  value={okrData.timeframe}
                  onChange={(e) => setOkrData({...okrData, timeframe: e.target.value})}
                />
                <Textarea
                  placeholder="Objective"
                  value={okrData.objective}
                  onChange={(e) => setOkrData({...okrData, objective: e.target.value})}
                  rows={2}
                  className="md:col-span-2"
                />
                <Textarea
                  placeholder="Key Results (one per line)"
                  value={okrData.key_results}
                  onChange={(e) => setOkrData({...okrData, key_results: e.target.value})}
                  rows={3}
                />
                <Input
                  placeholder="Target Values (comma-separated)"
                  value={okrData.target_values}
                  onChange={(e) => setOkrData({...okrData, target_values: e.target.value})}
                />
                <Input
                  placeholder="Current Values (comma-separated)"
                  value={okrData.current_values}
                  onChange={(e) => setOkrData({...okrData, current_values: e.target.value})}
                />
              </div>
              <Button
                onClick={trackOKRs}
                disabled={analyzing || !okrData.employee_id.trim()}
                className="w-full"
              >
                {analyzing ? 'Tracking...' : 'Track OKRs'}
              </Button>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Employee ID"
                  value={feedbackData.employee_id}
                  onChange={(e) => setFeedbackData({...feedbackData, employee_id: e.target.value})}
                />
                <Input
                  placeholder="Feedback Type"
                  value={feedbackData.feedback_type}
                  onChange={(e) => setFeedbackData({...feedbackData, feedback_type: e.target.value})}
                />
                <Input
                  placeholder="Reviewer ID"
                  value={feedbackData.reviewer_id}
                  onChange={(e) => setFeedbackData({...feedbackData, reviewer_id: e.target.value})}
                />
                <Input
                  placeholder="Context"
                  value={feedbackData.context}
                  onChange={(e) => setFeedbackData({...feedbackData, context: e.target.value})}
                  className="md:col-span-2"
                />
                <Textarea
                  placeholder="Feedback Text"
                  value={feedbackData.feedback_text}
                  onChange={(e) => setFeedbackData({...feedbackData, feedback_text: e.target.value})}
                  rows={4}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={analyzeFeedback}
                disabled={analyzing || !feedbackData.employee_id.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Feedback'}
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
                  {analysisResult.response.progress_percentage && (
                    <p><strong>Progress Percentage:</strong> {analysisResult.response.progress_percentage}%</p>
                  )}
                  {analysisResult.response.achievement_score && (
                    <p><strong>Achievement Score:</strong> {analysisResult.response.achievement_score}/100</p>
                  )}
                  {analysisResult.response.sentiment_score && (
                    <p><strong>Sentiment Score:</strong> {analysisResult.response.sentiment_score}/10</p>
                  )}
                  {analysisResult.response.key_themes && (
                    <div className="mt-2">
                      <strong>Key Themes:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.key_themes.map((theme: string, idx: number) => (
                          <li key={idx} className="text-sm">{theme}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.strengths && (
                    <div className="mt-2">
                      <strong>Strengths:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.development_areas && (
                    <div className="mt-2">
                      <strong>Development Areas:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.development_areas.map((area: string, idx: number) => (
                          <li key={idx} className="text-sm">{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.improvement_recommendations && (
                    <div className="mt-2">
                      <strong>Improvement Recommendations:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.improvement_recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm">{rec}</li>
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
