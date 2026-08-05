'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, Plus, Trash2, AlertTriangle } from 'lucide-react';
import type { Likelihood, Consequence, RiskLevel } from '@/types/iso';

interface RiskMatrixEntry {
  id: string;
  description: string;
  likelihood: Likelihood;
  consequence: Consequence;
  riskScore: number;
  riskLevel: RiskLevel;
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

const likelihoodLabels: Record<Likelihood, string> = {
  'rare': 'Rare',
  'unlikely': 'Unlikely',
  'possible': 'Possible',
  'likely': 'Likely',
  'almost-certain': 'Almost Certain',
};

const consequenceLabels: Record<Consequence, string> = {
  'insignificant': 'Insignificant',
  'minor': 'Minor',
  'moderate': 'Moderate',
  'major': 'Major',
  'catastrophic': 'Catastrophic',
};

export function RiskMatrixView() {
  const [entries, setEntries] = useState<RiskMatrixEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    description: '',
    likelihood: 'possible' as Likelihood,
    consequence: 'moderate' as Consequence,
  });

  const calculateRiskLevel = (likelihood: Likelihood, consequence: Consequence): RiskLevel => {
    const score = likelihoodScores[likelihood] * consequenceScores[consequence];
    if (score >= 17) return 'extreme';
    if (score >= 10) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  const addEntry = () => {
    if (!newEntry.description.trim()) return;

    const score = likelihoodScores[newEntry.likelihood] * consequenceScores[newEntry.consequence];
    const riskLevel = calculateRiskLevel(newEntry.likelihood, newEntry.consequence);

    const entry: RiskMatrixEntry = {
      id: `entry-${Date.now()}`,
      description: newEntry.description,
      likelihood: newEntry.likelihood,
      consequence: newEntry.consequence,
      riskScore: score,
      riskLevel,
    };

    setEntries(prev => [...prev, entry]);
    setNewEntry({
      description: '',
      likelihood: 'possible',
      consequence: 'moderate',
    });
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const getColor = (likelihood: Likelihood, consequence: Consequence) => {
    const score = likelihoodScores[likelihood] * consequenceScores[consequence];
    if (score <= 5) return 'bg-green-200';
    if (score <= 12) return 'bg-yellow-200';
    if (score <= 20) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'extreme': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  // Create matrix
  const likelihoods: Likelihood[] = ['rare', 'unlikely', 'possible', 'likely', 'almost-certain'];
  const consequences: Consequence[] = ['insignificant', 'minor', 'moderate', 'major', 'catastrophic'];

  const matrix = likelihoods.map(l => 
    consequences.map(c => ({
      likelihood: l,
      consequence: c,
      score: likelihoodScores[l] * consequenceScores[c],
      color: getColor(l, c),
    }))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            5x5 Risk Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Matrix */}
            <div className="grid grid-cols-6 gap-1">
              <div className="text-xs font-medium flex items-end justify-center pb-2">
                Impact →
              </div>
              {consequences.map(c => (
                <div key={c} className="text-xs text-center font-medium py-2">
                  {consequenceLabels[c]}
                </div>
              ))}
              
              {matrix.map((row, i) => (
                <React.Fragment key={i}>
                  <div className="text-xs font-medium flex items-center justify-end pr-2">
                    {i === 2 && (
                      <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        Likelihood
                      </span>
                    )}
                    {likelihoodLabels[row[0].likelihood]}
                  </div>
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className={`${cell.color} border border-gray-300 h-14 flex items-center justify-center text-sm font-semibold`}
                      title={`Score: ${cell.score}`}
                    >
                      {cell.score}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border" />
                <span>Low (1-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border" />
                <span>Medium (6-12)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-200 border" />
                <span>High (13-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border" />
                <span>Critical (21-25)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Risk Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Risk Description</Label>
            <Input
              placeholder="Describe the risk..."
              value={newEntry.description}
              onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Likelihood</Label>
              <Select
                value={newEntry.likelihood}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, likelihood: value as Likelihood }))}
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
                value={newEntry.consequence}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, consequence: value as Consequence }))}
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

          <Button onClick={addEntry} disabled={!newEntry.description.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add to Matrix
          </Button>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Entries ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded font-bold text-lg ${getLevelColor(entry.riskLevel)}`}>
                      {entry.riskScore}
                    </div>
                    <div>
                      <div className="font-medium">{entry.description}</div>
                      <div className="text-sm text-gray-500">
                        {likelihoodLabels[entry.likelihood]} × {consequenceLabels[entry.consequence]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor(entry.riskLevel)}>
                      {entry.riskLevel}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

