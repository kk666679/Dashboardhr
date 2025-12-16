'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Search, FileText, Users, Briefcase } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function TalentAcquisitionPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  const [resumeData, setResumeData] = useState({
    resume_text: '',
    job_requirements: '',
    qualifications: ''
  });
  const [interviewData, setInterviewData] = useState({
    candidate_id: '',
    questions: '',
    answers: '',
    interviewer_notes: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/talent-acquisition');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseResume = async () => {
    if (!resumeData.resume_text.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'parse_resume',
          module: 'talent-acquisition',
          data: {
            resume_text: resumeData.resume_text,
            job_requirements: resumeData.job_requirements.split('\n').map(req => req.trim()).filter(req => req),
            qualifications: resumeData.qualifications.split(',').map(qual => qual.trim())
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to parse resume:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeInterview = async () => {
    if (!interviewData.candidate_id.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'analyze_interview',
          module: 'talent-acquisition',
          data: {
            candidate_id: interviewData.candidate_id,
            questions: interviewData.questions.split('\n').map(q => q.trim()).filter(q => q),
            answers: interviewData.answers.split('\n').map(a => a.trim()).filter(a => a),
            interviewer_notes: interviewData.interviewer_notes
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze interview:', error);
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
        <Search className="h-8 w-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold">Talent Acquisition Agent</h1>
          <p className="text-muted-foreground">AI-powered resume parsing, candidate screening, and interview analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
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
            Select an analysis tool to process talent acquisition data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'resume' ? 'default' : 'outline'}
              onClick={() => setActiveTab('resume')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Resume Parsing
            </Button>
            <Button
              variant={activeTab === 'interview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('interview')}
            >
              <Users className="h-4 w-4 mr-2" />
              Interview Analysis
            </Button>
          </div>

          {activeTab === 'resume' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Paste resume text here..."
                value={resumeData.resume_text}
                onChange={(e) => setResumeData({...resumeData, resume_text: e.target.value})}
                rows={6}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  placeholder="Job Requirements (one per line)"
                  value={resumeData.job_requirements}
                  onChange={(e) => setResumeData({...resumeData, job_requirements: e.target.value})}
                  rows={4}
                />
                <Textarea
                  placeholder="Required Qualifications (comma-separated)"
                  value={resumeData.qualifications}
                  onChange={(e) => setResumeData({...resumeData, qualifications: e.target.value})}
                  rows={4}
                />
              </div>
              <Button
                onClick={parseResume}
                disabled={analyzing || !resumeData.resume_text.trim()}
                className="w-full"
              >
                {analyzing ? 'Parsing...' : 'Parse Resume'}
              </Button>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-4">
              <Input
                placeholder="Candidate ID"
                value={interviewData.candidate_id}
                onChange={(e) => setInterviewData({...interviewData, candidate_id: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  placeholder="Interview Questions (one per line)"
                  value={interviewData.questions}
                  onChange={(e) => setInterviewData({...interviewData, questions: e.target.value})}
                  rows={4}
                />
                <Textarea
                  placeholder="Candidate Answers (one per line)"
                  value={interviewData.answers}
                  onChange={(e) => setInterviewData({...interviewData, answers: e.target.value})}
                  rows={4}
                />
              </div>
              <Textarea
                placeholder="Interviewer Notes"
                value={interviewData.interviewer_notes}
                onChange={(e) => setInterviewData({...interviewData, interviewer_notes: e.target.value})}
                rows={3}
                className="md:col-span-2"
              />
              <Button
                onClick={analyzeInterview}
                disabled={analyzing || !interviewData.candidate_id.trim()}
                className="w-full"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Interview'}
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
                  {analysisResult.response.match_score && (
                    <p><strong>Match Score:</strong> {analysisResult.response.match_score}/100</p>
                  )}
                  {analysisResult.response.candidate_rating && (
                    <p><strong>Candidate Rating:</strong> {analysisResult.response.candidate_rating}/5</p>
                  )}
                  {analysisResult.response.skills_match && (
                    <div className="mt-2">
                      <strong>Skills Match:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.skills_match.map((skill: string, idx: number) => (
                          <li key={idx} className="text-sm">{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.missing_qualifications && (
                    <div className="mt-2">
                      <strong>Missing Qualifications:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.missing_qualifications.map((qual: string, idx: number) => (
                          <li key={idx} className="text-sm">{qual}</li>
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
                  {analysisResult.response.concerns && (
                    <div className="mt-2">
                      <strong>Concerns:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.concerns.map((concern: string, idx: number) => (
                          <li key={idx} className="text-sm">{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.recommendation && (
                    <p><strong>Recommendation:</strong> {analysisResult.response.recommendation}</p>
                  )}
                  {analysisResult.response.next_steps && (
                    <div className="mt-2">
                      <strong>Next Steps:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.next_steps.map((step: string, idx: number) => (
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
