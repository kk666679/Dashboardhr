'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, CheckCircle, GitBranch } from 'lucide-react';
import type { FishboneCategory, ISOStandard } from '@/types/iso';

interface Cause {
  id: string;
  description: string;
}

interface CategoryCauses {
  category: FishboneCategory;
  causes: Cause[];
}

interface FishboneAnalysis {
  problem: string;
  categories: CategoryCauses[];
  rootCauses: string[];
  recommendations: string[];
}

const categoryLabels: Record<FishboneCategory, string> = {
  'people': 'People',
  'process': 'Process',
  'equipment': 'Equipment',
  'materials': 'Materials',
  'environment': 'Environment',
  'management': 'Management',
};

const categoryColors: Record<FishboneCategory, string> = {
  'people': 'bg-blue-100 border-blue-200',
  'process': 'bg-green-100 border-green-200',
  'equipment': 'bg-orange-100 border-orange-200',
  'materials': 'bg-purple-100 border-purple-200',
  'environment': 'bg-teal-100 border-teal-200',
  'management': 'bg-red-100 border-red-200',
};

const allCategories: FishboneCategory[] = [
  'people', 'process', 'equipment', 'materials', 'environment', 'management'
];

interface FishboneProps {
  standard?: ISOStandard;
  /** Called with the problem — returns server-seeded causes per category. */
  onAnalyze?: (problem: string) => Promise<Record<string, string[]>>;
  isAnalyzing?: boolean;
  apiError?: string;
}

export function Fishbone({ onAnalyze, isAnalyzing = false, apiError }: FishboneProps) {
  const [problem, setProblem] = useState('');
  const [categories, setCategories] = useState<CategoryCauses[]>(
    allCategories.map(cat => ({ category: cat, causes: [] }))
  );
  const [newCause, setNewCause] = useState<{ category: FishboneCategory; description: string }>({
    category: 'people',
    description: '',
  });
  const [analysis, setAnalysis] = useState<FishboneAnalysis | null>(null);

  const addCause = () => {
    if (!newCause.description.trim()) return;

    setCategories(prev => prev.map(cat => {
      if (cat.category === newCause.category) {
        return {
          ...cat,
          causes: [...cat.causes, { id: `cause-${Date.now()}`, description: newCause.description }],
        };
      }
      return cat;
    }));

    setNewCause({ category: 'people', description: '' });
  };

  const removeCause = (category: FishboneCategory, causeId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.category === category) {
        return {
          ...cat,
          causes: cat.causes.filter(c => c.id !== causeId),
        };
      }
      return cat;
    }));
  };

  const analyze = async () => {
    if (!problem.trim()) return;

    // If server provides seed causes, merge them into local categories
    if (onAnalyze) {
      try {
        const serverCauses = await onAnalyze(problem);
        setCategories(prev => prev.map(cat => {
          const seeds: string[] = serverCauses[cat.category] ?? [];
          const serverEntries = seeds.map((desc, i) => ({
            id: `server-${cat.category}-${i}`,
            description: desc,
          }));
          return {
            ...cat,
            causes: [
              ...cat.causes,
              ...serverEntries.filter(e => !cat.causes.some(c => c.description === e.description)),
            ],
          };
        }));
      } catch { /* fall through to local analysis */ }
    }

    const allCauses = categories.flatMap(cat => cat.causes.map(c => c.description));
    const rootCauses = allCauses.slice(0, 3);
    const recommendations = [
      'Address identified root causes systematically',
      'Implement controls for each category',
      'Monitor effectiveness of changes',
      'Document lessons learned',
    ];

    setAnalysis({ problem, categories, rootCauses, recommendations });
  };

  const reset = () => {
    setProblem('');
    setCategories(allCategories.map(cat => ({ category: cat, causes: [] })));
    setNewCause({ category: 'people', description: '' });
    setAnalysis(null);
  };

  const totalCauses = categories.reduce((sum, cat) => sum + cat.causes.length, 0);

  return (
    <div className="space-y-6">
      {!analysis ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Fishbone Diagram (Ishikawa)
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={newCause.category}
                    onChange={(e) => setNewCause(prev => ({ ...prev, category: e.target.value as FishboneCategory }))}
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Cause Description</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Enter a cause..."
                      value={newCause.description}
                      onChange={(e) => setNewCause(prev => ({ ...prev, description: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addCause()}
                    />
                    <Button onClick={addCause} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {totalCauses} causes added across {categories.filter(c => c.causes.length > 0).length} categories
              </div>

              <Button
                onClick={analyze}
                disabled={!problem.trim() || totalCauses === 0 || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing…' : 'Generate Fishbone Diagram'}
              </Button>
              {apiError && <p className="text-sm text-destructive">{apiError}</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card key={cat.category} className={cat.causes.length > 0 ? 'ring-2 ring-blue-200' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{categoryLabels[cat.category]}</CardTitle>
                </CardHeader>
                <CardContent>
                  {cat.causes.length > 0 ? (
                    <ul className="space-y-2">
                      {cat.causes.map((cause) => (
                        <li key={cause.id} className="flex items-start justify-between text-sm">
                          <span>{cause.description}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCause(cat.category, cause.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-400 italic">No causes added</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Fishbone Diagram Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Problem Box */}
              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Effect / Problem</div>
                <div className="text-xl font-bold">{analysis.problem}</div>
              </div>

              {/* Fishbone Structure */}
              <div className="relative">
                {/* Main spine */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300" />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[40px] border-l-gray-300 border-b-[20px] border-b-transparent" />
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 gap-8 pt-8">
                  {/* Left side categories */}
                  <div className="space-y-6">
                    {categories.slice(0, 3).map((cat, index) => (
                      <div key={cat.category} className="relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className={categoryColors[cat.category]}>{categoryLabels[cat.category]}</Badge>
                        </div>
                        <div className={`p-3 border-2 rounded-lg mt-2 ${categoryColors[cat.category]}`}>
                          {cat.causes.length > 0 ? (
                            <ul className="space-y-1 text-sm">
                              {cat.causes.map(cause => (
                                <li key={cause.id} className="flex items-start gap-1">
                                  <span>•</span>
                                  <span>{cause.description}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-sm text-gray-500">No causes</span>
                          )}
                        </div>
                        {/* Bone line */}
                        <div 
                          className="absolute top-1/2 right-0 w-8 h-0.5 bg-gray-300"
                          style={{ transform: 'rotate(-30deg)', right: '-32px' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right side categories */}
                  <div className="space-y-6">
                    {categories.slice(3).map((cat) => (
                      <div key={cat.category} className="relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className={categoryColors[cat.category]}>{categoryLabels[cat.category]}</Badge>
                        </div>
                        <div className={`p-3 border-2 rounded-lg mt-2 ${categoryColors[cat.category]}`}>
                          {cat.causes.length > 0 ? (
                            <ul className="space-y-1 text-sm">
                              {cat.causes.map(cause => (
                                <li key={cause.id} className="flex items-start gap-1">
                                  <span>•</span>
                                  <span>{cause.description}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-sm text-gray-500">No causes</span>
                          )}
                        </div>
                        {/* Bone line */}
                        <div 
                          className="absolute top-1/2 right-0 w-8 h-0.5 bg-gray-300"
                          style={{ transform: 'rotate(30deg)', right: '-32px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={reset} variant="outline" className="w-full">
                Start New Analysis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Root Causes & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.rootCauses.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Identified Root Causes:</div>
                  <ul className="space-y-2">
                    {analysis.rootCauses.map((cause, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                        <span className="font-bold text-red-600">{index + 1}.</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="text-sm font-medium mb-2">Recommendations:</div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

