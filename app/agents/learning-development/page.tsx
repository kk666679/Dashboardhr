'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Lightbulb, FileText, TrendingUp, BookOpen, Target } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function LearningDevelopmentPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gap');
  const [gapData, setGapData] = useState({
    employee_id: '',
    current_skills: '',
    required_skills: '',
    job_role: '',
    department: ''
  });
  const [pathData, setPathData] = useState({
    employee_profile: '',
    skills_gaps: '',
    career_goals: '',
    time_availability: '',
    learning_style: '',
    budget_constraints: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/learning-development');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkillsGap = async () => {
    if (!gapData.employee_id.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'analyze_skills_gap',
          module: 'learning-development',
          data: {
            ...gapData,
            current_skills: gapData.current_skills.split(',').map(s => ({ skill: s.trim(), level: 50 })),
            required_skills: gapData.required_skills.split(',').map(s => ({ skill: s.trim(), level: 80 }))
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze skills gap:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const createLearningPath = async () => {
    if (!pathData.employee_profile.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'create_learning_path',
          module: 'learning-development',
          data: {
            ...pathData,
            skills_gaps: pathData.skills_gaps.split(',').map(g => g.trim()),
            career_goals: pathData.career_goals.split(',').map(g => g.trim()),
            preferences: [],
            family_status: 'single',
            health_needs: [],
            financial_goals: []
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to create learning path:', error);
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
        <Lightbulb className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold">Learning & Development Agent</h1>
          <p className="text-muted-foreground">AI-powered skills gap analysis, learning paths, and training ROI prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
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
            Select an analysis tool to process learning and development data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'gap' ? 'default' : 'outline'}
              onClick={() => setActiveTab('gap')}
            >
              <Target className="h-4 w-4 mr-2" />
              Skills Gap Analysis
            </Button>
            <Button
              variant={activeTab === 'path' ? 'default' : 'outline'}
              onClick={() => setActiveTab('path')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Learning Path Creation
            </Button>
          </div>

          {activeTab === 'gap' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Employee ID"
                  value={gapData.employee_id}
                  onChange={(e) => setGapData({...gapData, employee_id: e.target.value})}
                />
                <Input
                  placeholder="Job Role"
                  value={gapData.job_role}
                  onChange={(e) => setGapData({...gapData, job_role: e.target.value})}
                />
                <Input
                  placeholder="Department"
                  value={gapData.department}
                  onChange={(e) => setGapData({...gapData, department: e.target.value})}
                />
                <Input
                  placeholder="Current Skills (comma-separated)"
                  value={gapData.current_skills}
                  onChange={(e) => setGapData({...gapData, current_skills: e.target.value})}
                />
                <Input
                  placeholder="Required Skills (comma-separated)"
                  value={gapData.required_skills}
                  onChange={(e) => setGapData({...gapData, required_skills: e.target.value})}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={analyzeSkillsGap}
                disabled={analyzing || !gapData.employee_id.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Skills Gap'}
              </Button>
            </div>
          )}

          {activeTab === 'path' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Employee Profile (JSON format)"
                value={pathData.employee_profile}
                onChange={(e) => setPathData({...pathData, employee_profile: e.target.value})}
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Skills Gaps (comma-separated)"
                  value={pathData.skills_gaps}
                  onChange={(e) => setPathData({...pathData, skills_gaps: e.target.value})}
                />
                <Input
                  placeholder="Career Goals (comma-separated)"
                  value={pathData.career_goals}
                  onChange={(e) => setPathData({...pathData, career_goals: e.target.value})}
                />
                <Input
                  placeholder="Time Availability"
                  value={pathData.time_availability}
                  onChange={(e) => setPathData({...pathData, time_availability: e.target.value})}
                />
                <Input
                  placeholder="Learning Style"
                  value={pathData.learning_style}
                  onChange={(e) => setPathData({...pathData, learning_style: e.target.value})}
                />
                <Input
                  placeholder="Budget Constraints (RM)"
                  value={pathData.budget_constraints}
                  onChange={(e) => setPathData({...pathData, budget_constraints: e.target.value})}
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={createLearningPath}
                disabled={analyzing || !pathData.employee_profile.trim()}
                className="w-full"
              >
                {analyzing ? 'Creating...' : 'Create Learning Path'}
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
                  {analysisResult.response.identified_gaps && (
                    <div className="mt-2">
                      <strong>Identified Gaps:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.identified_gaps.map((gap: any, idx: number) => (
                          <li key={idx} className="text-sm">{gap.skill}: {gap.gap_severity} gap</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.overall_readiness && (
                    <p><strong>Overall Readiness:</strong> {analysisResult.response.overall_readiness}%</p>
                  )}
                  {analysisResult.response.recommended_training && (
                    <div className="mt-2">
                      <strong>Recommended Training:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.recommended_training.map((training: string, idx: number) => (
                          <li key={idx} className="text-sm">{training}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.path_name && (
                    <p><strong>Learning Path:</strong> {analysisResult.response.path_name}</p>
                  )}
                  {analysisResult.response.duration_weeks && (
                    <p><strong>Duration:</strong> {analysisResult.response.duration_weeks} weeks</p>
                  )}
                  {analysisResult.response.modules && (
                    <div className="mt-2">
                      <strong>Modules:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.modules.map((module: any, idx: number) => (
                          <li key={idx} className="text-sm">{module.title} ({module.duration_hours}h)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.certifications && (
                    <div className="mt-2">
                      <strong>Certifications:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.certifications.map((cert: string, idx: number) => (
                          <li key={idx} className="text-sm">{cert}</li>
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
