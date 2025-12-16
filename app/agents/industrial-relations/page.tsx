'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { AlertCircle, Shield, FileText, TrendingUp } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function IndustrialRelationsPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [disputeDescription, setDisputeDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/industrial-relations');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeDispute = async () => {
    if (!disputeDescription.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'analyze_dispute',
          module: 'industrial-relations',
          data: {
            description: disputeDescription,
            parties_involved: ['Management', 'Union'],
            dispute_type: 'Working Conditions',
            timeline: 'Recent'
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze dispute:', error);
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
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Industrial Relations Agent</h1>
          <p className="text-muted-foreground">AI-powered dispute resolution and compliance management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
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
          <CardTitle>Dispute Analysis</CardTitle>
          <CardDescription>
            Analyze workplace disputes with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the dispute situation..."
            value={disputeDescription}
            onChange={(e) => setDisputeDescription(e.target.value)}
            rows={4}
          />
          <Button
            onClick={analyzeDispute}
            disabled={analyzing || !disputeDescription.trim()}
            className="w-full"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Dispute'}
          </Button>

          {analysisResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Analysis Result:</h4>
              <div className="space-y-2">
                <p><strong>Success:</strong> {analysisResult.success ? 'Yes' : 'No'}</p>
                {analysisResult.response && (
                  <div>
                    <p><strong>Risk Level:</strong> {analysisResult.response.risk_level}</p>
                    <p><strong>Confidence:</strong> {Math.round(analysisResult.response.confidence_score * 100)}%</p>
                    <div className="mt-2">
                      <strong>Recommended Actions:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.recommended_actions?.map((action: string, idx: number) => (
                          <li key={idx} className="text-sm">{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {analysisResult.message && (
                  <p><strong>Message:</strong> {analysisResult.message}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
