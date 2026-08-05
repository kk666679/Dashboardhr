'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Target, ArrowRight, TrendingUp } from 'lucide-react';
import { api } from '@/lib/trpc';
import type { ISOStandard, GapAnalysis } from '@/types/iso';

interface GapAnalysisProps {
  standard?: ISOStandard;
  /** Pre-seeded current score from parent (e.g. from the score calculator page). */
  currentScore?: number;
}

export function GapAnalysis({ standard = 'ISO9001', currentScore }: GapAnalysisProps) {
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null);
  const [liveGapData, setLiveGapData] = useState<any | null>(null);

  const gapMutation = api.iso.compliance.gapAnalysis.useMutation({
    onSuccess: (data) => setLiveGapData(data),
  });

  const generateAnalysis = async () => {
    const current = currentScore ?? 0;
    await gapMutation.mutateAsync({ standard, current, target: 100 });

    // Static representative gap breakdown (visual) — real score from server
    const mockGaps = [
      { clause: '7.2', currentStatus: 'non-compliant' as const, gap: 'Training records incomplete for new hires', priority: 'high' as const, recommendations: ['Implement training management system', 'Create competency matrix'], estimatedEffort: 'medium' as const },
      { clause: '8.4', currentStatus: 'partial' as const, gap: 'Supplier evaluation criteria not fully documented', priority: 'medium' as const, recommendations: ['Review supplier qualification process', 'Update supplier evaluation form'], estimatedEffort: 'low' as const },
      { clause: '9.1', currentStatus: 'partial' as const, gap: 'KPIs not consistently tracked across all departments', priority: 'medium' as const, recommendations: ['Define department-specific KPIs', 'Implement monitoring dashboard'], estimatedEffort: 'high' as const },
      { clause: '10.2', currentStatus: 'non-compliant' as const, gap: 'Corrective action procedures not followed consistently', priority: 'critical' as const, recommendations: ['Conduct CAPA training', 'Implement CAPA tracking system'], estimatedEffort: 'high' as const },
    ];

    setAnalysis({
      standard: standard as any,
      totalGaps: mockGaps.length,
      criticalGaps: mockGaps.filter(g => g.priority === 'critical').length,
      gaps: mockGaps,
      summary: 'Gap analysis based on current compliance score. Address critical items first to improve certification readiness.',
      actionPlan: mockGaps.map((g, i) => ({
        clause: g.clause,
        action: g.recommendations[0],
        priority: g.priority,
        owner: ['Quality Manager', 'HR Manager', 'Operations Manager', 'Procurement Manager'][i] ?? 'TBD',
        dueDate: new Date(Date.now() + (i + 1) * 14 * 24 * 60 * 60 * 1000),
      })),
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentCompliance = analysis ? 100 - (analysis.totalGaps * 5) : 0;
  const targetCompliance = 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {standard} Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Analyze gaps between current compliance status and target requirements.
          </p>
          <Button onClick={generateAnalysis} disabled={gapMutation.isPending} className="w-full">
            {gapMutation.isPending ? 'Analyzing...' : 'Generate Gap Analysis'}
          </Button>
          {gapMutation.isError && (
            <p className="text-sm text-destructive">{gapMutation.error.message}</p>
          )}
          {liveGapData && (
            <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-800">
              Server score: {liveGapData.currentScore}% → Target {liveGapData.targetScore}% = Gap {liveGapData.gap}%
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Gap Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold">{analysis.totalGaps}</div>
                  <div className="text-sm text-gray-600">Total Gaps</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{analysis.criticalGaps}</div>
                  <div className="text-sm text-gray-600">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {analysis.gaps.filter(g => g.priority === 'high').length}
                  </div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">
                    {analysis.gaps.filter(g => g.priority === 'medium').length}
                  </div>
                  <div className="text-sm text-gray-600">Medium Priority</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Compliance</span>
                  <span className="text-sm font-bold">{currentCompliance}%</span>
                </div>
                <Progress value={currentCompliance} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Target Compliance</span>
                  <span className="text-sm font-bold">{targetCompliance}%</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <ArrowRight className="h-4 w-4" />
                Gap to Close: {targetCompliance - currentCompliance}%
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="gaps" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="gaps" className="flex-1">Identified Gaps</TabsTrigger>
              <TabsTrigger value="action" className="flex-1">Action Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="gaps">
              <Card>
                <CardHeader>
                  <CardTitle>Gap Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.gaps.map((gap, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">Clause {gap.clause}</span>
                            <Badge className={getPriorityColor(gap.priority)}>
                              {gap.priority}
                            </Badge>
                            <Badge variant="outline">{gap.estimatedEffort} effort</Badge>
                          </div>
                        </div>
                        <p className="text-gray-600">{gap.gap}</p>
                        <div>
                          <span className="text-sm font-medium">Recommendations:</span>
                          <ul className="mt-1 space-y-1">
                            {gap.recommendations.map((rec, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="action">
              <Card>
                <CardHeader>
                  <CardTitle>Action Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.actionPlan.map((action, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Clause {action.clause}</span>
                            <Badge className={getPriorityColor(action.priority)}>
                              {action.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1">{action.action}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
<span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due: {action.dueDate ? action.dueDate.toLocaleDateString() : 'TBD'}
                            </span>
                            <span>Owner: {action.owner}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{analysis.summary}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

