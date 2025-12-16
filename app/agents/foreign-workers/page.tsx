'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Shield, FileText, Globe, TrendingUp, AlertTriangle } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function ForeignWorkersPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('permit');
  const [permitData, setPermitData] = useState({
    worker_id: '',
    permit_type: '',
    expiry_date: '',
    nationality: '',
    employment_status: ''
  });
  const [communicationData, setCommunicationData] = useState({
    message: '',
    source_language: '',
    target_language: 'en',
    context: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/foreign-workers');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictPermitRenewal = async () => {
    if (!permitData.worker_id.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'predict_permit_renewal',
          module: 'foreign-workers',
          data: permitData
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to predict permit renewal:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const translateCommunication = async () => {
    if (!communicationData.message.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'translate_communication',
          module: 'foreign-workers',
          data: communicationData
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to translate communication:', error);
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
        <Shield className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">Foreign Workers Agent</h1>
          <p className="text-muted-foreground">AI-powered permit management, compliance monitoring, and multi-language support</p>
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
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
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
            Select an analysis tool to process foreign worker data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'permit' ? 'default' : 'outline'}
              onClick={() => setActiveTab('permit')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Permit Renewal
            </Button>
            <Button
              variant={activeTab === 'communication' ? 'default' : 'outline'}
              onClick={() => setActiveTab('communication')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Communication Translation
            </Button>
          </div>

          {activeTab === 'permit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Worker ID"
                  value={permitData.worker_id}
                  onChange={(e) => setPermitData({...permitData, worker_id: e.target.value})}
                />
                <Input
                  placeholder="Permit Type"
                  value={permitData.permit_type}
                  onChange={(e) => setPermitData({...permitData, permit_type: e.target.value})}
                />
                <Input
                  placeholder="Expiry Date (YYYY-MM-DD)"
                  value={permitData.expiry_date}
                  onChange={(e) => setPermitData({...permitData, expiry_date: e.target.value})}
                />
                <Input
                  placeholder="Nationality"
                  value={permitData.nationality}
                  onChange={(e) => setPermitData({...permitData, nationality: e.target.value})}
                />
                <Input
                  placeholder="Employment Status"
                  value={permitData.employment_status}
                  onChange={(e) => setPermitData({...permitData, employment_status: e.target.value})}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={predictPermitRenewal}
                disabled={analyzing || !permitData.worker_id.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Predict Permit Renewal'}
              </Button>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter message to translate..."
                value={communicationData.message}
                onChange={(e) => setCommunicationData({...communicationData, message: e.target.value})}
                rows={4}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Source Language (auto-detect if empty)"
                  value={communicationData.source_language}
                  onChange={(e) => setCommunicationData({...communicationData, source_language: e.target.value})}
                />
                <Input
                  placeholder="Target Language (en, ms, zh, ta, bn, ne, id)"
                  value={communicationData.target_language}
                  onChange={(e) => setCommunicationData({...communicationData, target_language: e.target.value})}
                />
                <Input
                  placeholder="Context"
                  value={communicationData.context}
                  onChange={(e) => setCommunicationData({...communicationData, context: e.target.value})}
                />
              </div>
              <Button
                onClick={translateCommunication}
                disabled={analyzing || !communicationData.message.trim()}
                className="w-full"
              >
                {analyzing ? 'Translating...' : 'Translate Communication'}
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
                  {analysisResult.response.renewal_required !== undefined && (
                    <p><strong>Renewal Required:</strong> {analysisResult.response.renewal_required ? 'Yes' : 'No'}</p>
                  )}
                  {analysisResult.response.renewal_date && (
                    <p><strong>Renewal Date:</strong> {analysisResult.response.renewal_date}</p>
                  )}
                  {analysisResult.response.documents_needed && (
                    <div className="mt-2">
                      <strong>Documents Needed:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.documents_needed.map((doc: string, idx: number) => (
                          <li key={idx} className="text-sm">{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.risk_assessment && (
                    <p><strong>Risk Assessment:</strong> {analysisResult.response.risk_assessment}</p>
                  )}
                  {analysisResult.response.detected_language && (
                    <p><strong>Detected Language:</strong> {analysisResult.response.detected_language}</p>
                  )}
                  {analysisResult.response.translated_message && (
                    <p><strong>Translated Message:</strong> {analysisResult.response.translated_message}</p>
                  )}
                  {analysisResult.response.recommended_response && (
                    <p><strong>Recommended Response:</strong> {analysisResult.response.recommended_response}</p>
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
