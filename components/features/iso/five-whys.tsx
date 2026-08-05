'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, ArrowRight, CheckCircle, Lightbulb } from 'lucide-react';

interface WhyEntry {
  level: number;
  question: string;
  answer: string;
}

interface FiveWhysAnalysis {
  problem: string;
  whys: WhyEntry[];
  rootCause: string;
  recommendations: string[];
}

interface FiveWhysProps {
  /** Called with the problem statement — returns API-seeded why entries. */
  onAnalyze?: (problem: string) => Promise<Array<{ level: number; question: string; answer: string }>>;
  isAnalyzing?: boolean;
  apiError?: string;
}

export function FiveWhys({ onAnalyze, isAnalyzing = false, apiError }: FiveWhysProps) {
  const [problem, setProblem] = useState('');
  const [whys, setWhys] = useState<WhyEntry[]>([
    { level: 1, question: '', answer: '' },
  ]);
  const [rootCause, setRootCause] = useState('');
  const [analysis, setAnalysis] = useState<FiveWhysAnalysis | null>(null);

  const addWhy = () => {
    if (whys.length >= 5) return;
    setWhys(prev => [
      ...prev,
      { level: prev.length + 1, question: '', answer: '' },
    ]);
  };

  const removeWhy = (level: number) => {
    if (whys.length <= 1) return;
    setWhys(prev => prev.filter(w => w.level !== level).map((w, i) => ({ ...w, level: i + 1 })));
  };

  const updateWhy = (level: number, field: 'question' | 'answer', value: string) => {
    setWhys(prev => prev.map(w => w.level === level ? { ...w, [field]: value } : w));
  };

  const analyze = async () => {
    if (!problem.trim()) return;

    // If server handler provided, seed questions from the API response
    let seededWhys = [...whys];
    if (onAnalyze) {
      try {
        const apiWhys = await onAnalyze(problem);
        seededWhys = apiWhys.length > 0 ? apiWhys : whys;
      } catch { /* fall through to local analysis */ }
    }

    const generatedWhys = seededWhys.map((why, index) => {
      let question = why.question;
      if (!question && index > 0 && seededWhys[index - 1].answer) {
        question = `Why ${seededWhys[index - 1].answer.toLowerCase()}?`;
      } else if (!question && index === 0) {
        question = `Why does this problem occur?`;
      }
      return { ...why, question };
    });

    const recommendations = [
      'Implement preventive measures targeting the root cause',
      'Update relevant procedures and work instructions',
      'Conduct training on the corrected process',
      'Monitor effectiveness after 30/60/90 days',
    ];

    setAnalysis({
      problem,
      whys: generatedWhys,
      rootCause: rootCause || generatedWhys[generatedWhys.length - 1]?.answer || 'Unknown',
      recommendations,
    });
  };

  const reset = () => {
    setProblem('');
    setWhys([{ level: 1, question: '', answer: '' }]);
    setRootCause('');
    setAnalysis(null);
  };

  return (
    <div className="space-y-6">
      {!analysis ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                5 Whys Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Problem Statement *</Label>
                <Textarea
                  placeholder="Describe the problem to analyze..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Why Analysis Chain</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addWhy}
                    disabled={whys.length >= 5}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Why
                  </Button>
                </div>

                {whys.map((why, index) => (
                  <div key={why.level} className="space-y-3">
                    {index > 0 && (
                      <div className="flex justify-center">
                        <ArrowRight className="h-5 w-5 text-gray-400 rotate-90" />
                      </div>
                    )}
                    
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Why #{why.level}</Badge>
                        {whys.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWhy(why.level)}
                          >
                            <Minus className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          placeholder={index === 0 ? "Why does this problem occur?" : `Why ${whys[index - 1]?.answer ? whys[index - 1].answer.toLowerCase() : ''}?`}
                          value={why.question}
                          onChange={(e) => updateWhy(why.level, 'question', e.target.value)}
                        />
                        <Textarea
                          placeholder="Enter your answer..."
                          value={why.answer}
                          onChange={(e) => updateWhy(why.level, 'answer', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label>Identified Root Cause</Label>
                <Textarea
                  placeholder="Based on your analysis, what is the root cause?"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={analyze}
                disabled={!problem.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing…' : 'Analyze'}
              </Button>
              {apiError && <p className="text-sm text-destructive">{apiError}</p>}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Problem</div>
                <div className="text-lg font-semibold">{analysis.problem}</div>
              </div>

              <div className="space-y-2">
                {analysis.whys.map((why, index) => (
                  <div key={why.level} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{why.level}</span>
                    </div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">{why.question}</div>
                      <div className="font-medium mt-1">{why.answer || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Root Cause Identified
                </div>
                <div className="text-lg font-semibold">{analysis.rootCause}</div>
              </div>

              <Button onClick={reset} variant="outline" className="w-full">
                Start New Analysis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

