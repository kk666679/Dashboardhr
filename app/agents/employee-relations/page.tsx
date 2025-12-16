'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Users, MessageSquare, Heart, AlertTriangle, FileText } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function EmployeeRelationsPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('emotion');
  const [emotionText, setEmotionText] = useState('');
  const [conflictData, setConflictData] = useState({
    description: '',
    parties: '',
    type: '',
    duration: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/employee-relations');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmotion = async () => {
    if (!emotionText.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'analyze_emotion',
          module: 'employee-relations',
          data: {
            text: emotionText,
            context: 'Employee feedback',
            language: 'en'
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze emotion:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const mediateConflict = async () => {
    if (!conflictData.description.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'mediate_conflict',
          module: 'employee-relations',
          data: {
            description: conflictData.description,
            parties_involved: conflictData.parties.split(','),
            conflict_type: conflictData.type,
            duration: conflictData.duration
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to mediate conflict:', error);
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
        <Users className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Employee Relations Agent</h1>
          <p className="text-muted-foreground">AI-powered emotion detection, conflict mediation, and culture health assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
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
            Select an analysis tool to process employee relations data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'emotion' ? 'default' : 'outline'}
              onClick={() => setActiveTab('emotion')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Emotion Analysis
            </Button>
            <Button
              variant={activeTab === 'conflict' ? 'default' : 'outline'}
              onClick={() => setActiveTab('conflict')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Conflict Mediation
            </Button>
          </div>

          {activeTab === 'emotion' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter employee feedback or communication text..."
                value={emotionText}
                onChange={(e) => setEmotionText(e.target.value)}
                rows={4}
              />
              <Button
                onClick={analyzeEmotion}
                disabled={analyzing || !emotionText.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Emotion'}
              </Button>
            </div>
          )}

          {activeTab === 'conflict' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Describe the conflict situation..."
                value={conflictData.description}
                onChange={(e) => setConflictData({...conflictData, description: e.target.value})}
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Parties involved (comma-separated)"
                  value={conflictData.parties}
                  onChange={(e) => setConflictData({...conflictData, parties: e.target.value})}
                />
                <Input
                  placeholder="Conflict type"
                  value={conflictData.type}
                  onChange={(e) => setConflictData({...conflictData, type: e.target.value})}
                />
                <Input
                  placeholder="Duration"
                  value={conflictData.duration}
                  onChange={(e) => setConflictData({...conflictData, duration: e.target.value})}
                />
              </div>
              <Button
                onClick={mediateConflict}
                disabled={analyzing || !conflictData.description.trim()}
                className="w-full"
              >
                {analyzing ? 'Mediating...' : 'Generate Mediation Strategy'}
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
                  {analysisResult.response.dominant_emotion && (
                    <p><strong>Dominant Emotion:</strong> {analysisResult.response.dominant_emotion}</p>
                  )}
                  {analysisResult.response.emotion_intensity && (
                    <p><strong>Emotion Intensity:</strong> {analysisResult.response.emotion_intensity}</p>
                  )}
                  {analysisResult.response.sentiment_score && (
                    <p><strong>Sentiment Score:</strong> {analysisResult.response.sentiment_score}</p>
                  )}
                  {analysisResult.response.conflict_type && (
                    <p><strong>Conflict Type:</strong> {analysisResult.response.conflict_type}</p>
                  )}
                  {analysisResult.response.severity_level && (
                    <p><strong>Severity Level:</strong> {analysisResult.response.severity_level}</p>
                  )}
                  {analysisResult.response.recommended_actions && (
                    <div className="mt-2">
                      <strong>Recommended Actions:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.recommended_actions.map((action: string, idx: number) => (
                          <li key={idx} className="text-sm">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.suggested_steps && (
                    <div className="mt-2">
                      <strong>Suggested Steps:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.suggested_steps.map((step: string, idx: number) => (
                          <li key={idx} className="text-sm">{step}</li>
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
