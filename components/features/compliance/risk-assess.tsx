'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Activity, CheckCircle } from 'lucide-react';
import type { RiskCategory, Likelihood, Consequence, RiskLevel } from '@/types/iso';

interface RiskAssessProps {
  defaultCategory?: RiskCategory;
}

interface RiskEntry {
  id: string;
  description: string;
  category: RiskCategory;
  likelihood: Likelihood;
  consequence: Consequence;
  riskScore: number;
  riskLevel: RiskLevel;
  controls: string[];
  recommendations: string[];
}

const likelihoodScores: Record<Likelihood, number> = {
  'rare': 1,
  'unlikely': 2,
  'possible': 3,
  'likely': 4,
  'almost-certain': 5,
};

const consequenceScores: Record<Consequence, number> = {
  'insignificant': 1,
  'minor': 2,
  'moderate': 3,
  'major': 4,
  'catastrophic': 5,
};

export function RiskAssess({ defaultCategory = 'quality' }: RiskAssessProps) {
  const [risks, setRisks] = useState<RiskEntry[]>([]);
  const [newRisk, setNewRisk] = useState({
    description: '',
    category: defaultCategory,
    likelihood: 'possible' as Likelihood,
    consequence: 'moderate' as Consequence,
    controls: '',
  });
  const [isAssessing, setIsAssessing] = useState(false);

  const calculateRiskLevel = (likelihood: Likelihood, consequence: Consequence): RiskLevel => {
    const score = likelihoodScores[likelihood] * consequenceScores[consequence];
    if (score >= 17) return 'extreme';
    if (score >= 10) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  const assessRisk = () => {
    if (!newRisk.description.trim()) return;
    setIsAssessing(true);

    setTimeout(() => {
      const score = likelihoodScores[newRisk.likelihood] * consequenceScores[newRisk.consequence];
      const riskLevel = calculateRiskLevel(newRisk.likelihood, newRisk.consequence);
      
      const controls = newRisk.controls.split('\n').filter(c => c.trim());
      const recommendations = getRecommendations(newRisk.category, riskLevel);

      const risk: RiskEntry = {
        id: `risk-${Date.now()}`,
        description: newRisk.description,
        category: newRisk.category,
        likelihood: newRisk.likelihood,
        consequence: newRisk.consequence,
        riskScore: score,
        riskLevel,
        controls,
        recommendations,
      };

      setRisks(prev => [...prev, risk]);
      setNewRisk({
        description: '',
        category: defaultCategory,
        likelihood: 'possible',
        consequence: 'moderate',
        controls: '',
      });
      setIsAssessing(false);
    }, 1000);
  };

  const getRecommendations = (category: RiskCategory, level: RiskLevel): string[] => {
    const baseRecs: Record<RiskCategory, string[]> = {
      quality: ['Implement quality control checkpoints', 'Review process documentation', 'Train staff on procedures'],
      environmental: ['Review environmental impacts', 'Update waste management', 'Monitor emissions'],
      safety: ['Review safety procedures', 'Update PPE requirements', 'Conduct safety training'],
      security: ['Review access controls', 'Update security protocols', 'Conduct security audit'],
      operational: ['Review operational procedures', 'Update maintenance schedules', 'Test contingency plans'],
      strategic: ['Review strategic objectives', 'Update risk register', 'Board review required'],
    };

    if (level === 'extreme') {
      return ['IMMEDIATE ACTION REQUIRED', ...baseRecs[category]];
    } else if (level === 'high') {
      return ['Priority action needed within 30 days', ...baseRecs[category].slice(0, 2)];
    }
    return baseRecs[category].slice(0, 2);
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const removeRisk = (id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
  };

  const extremeCount = risks.filter(r => r.riskLevel === 'extreme').length;
  const highCount = risks.filter(r => r.riskLevel === 'high').length;
  const mediumCount = risks.filter(r => r.riskLevel === 'medium').length;
  const lowCount = risks.filter(r => r.riskLevel === 'low').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Risk Description</Label>
            <Textarea
              placeholder="Describe the risk..."
              value={newRisk.description}
              onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={newRisk.category}
                onValueChange={(value) => setNewRisk(prev => ({ ...prev, category: value as RiskCategory }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Likelihood</Label>
              <Select
                value={newRisk.likelihood}
                onValueChange={(value) => setNewRisk(prev => ({ ...prev, likelihood: value as Likelihood }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rare">Rare (1)</SelectItem>
                  <SelectItem value="unlikely">Unlikely (2)</SelectItem>
                  <SelectItem value="possible">Possible (3)</SelectItem>
                  <SelectItem value="likely">Likely (4)</SelectItem>
                  <SelectItem value="almost-certain">Almost Certain (5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Consequence</Label>
              <Select
                value={newRisk.consequence}
                onValueChange={(value) => setNewRisk(prev => ({ ...prev, consequence: value as Consequence }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insignificant">Insignificant (1)</SelectItem>
                  <SelectItem value="minor">Minor (2)</SelectItem>
                  <SelectItem value="moderate">Moderate (3)</SelectItem>
                  <SelectItem value="major">Major (4)</SelectItem>
                  <SelectItem value="catastrophic">Catastrophic (5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Existing Controls (one per line)</Label>
            <Textarea
              placeholder="List existing controls..."
              value={newRisk.controls}
              onChange={(e) => setNewRisk(prev => ({ ...prev, controls: e.target.value }))}
              className="mt-1"
            />
          </div>

          <Button
            onClick={assessRisk}
            disabled={!newRisk.description.trim() || isAssessing}
            className="w-full"
          >
            {isAssessing ? 'Assessing...' : 'Assess Risk'}
          </Button>
        </CardContent>
      </Card>

      {risks.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Risk Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{extremeCount}</div>
                  <div className="text-sm text-gray-600">Extreme</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{highCount}</div>
                  <div className="text-sm text-gray-600">High</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{mediumCount}</div>
                  <div className="text-sm text-gray-600">Medium</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{lowCount}</div>
                  <div className="text-sm text-gray-600">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {risks.map((risk) => (
              <Card key={risk.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{risk.description}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(risk.riskLevel)}>
                        {risk.riskLevel.toUpperCase()} ({risk.riskScore})
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeRisk(risk.id)}>
                        ×
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium">{risk.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Likelihood:</span>
                      <span className="ml-2 font-medium">{risk.likelihood}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Consequence:</span>
                      <span className="ml-2 font-medium">{risk.consequence}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Score:</span>
                      <span className="ml-2 font-bold">{risk.riskScore}</span>
                    </div>
                  </div>

                  {risk.recommendations.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Recommendations:</div>
                      <ul className="space-y-1">
                        {risk.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

