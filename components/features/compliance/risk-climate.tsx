'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, CloudRain, Wind, Waves, Thermometer, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ClimateHazard, Likelihood, Consequence } from '@/types/iso';

interface ClimateRisk {
  id: string;
  hazard: ClimateHazard;
  description: string;
  likelihood: Likelihood;
  consequence: Consequence;
  adaptationMeasures: string[];
}

const hazardIcons: Record<ClimateHazard, React.ReactNode> = {
  'extreme-heat': <Thermometer className="h-5 w-5 text-red-500" />,
  'flooding': <Waves className="h-5 w-5 text-blue-500" />,
  'drought': <Sun className="h-5 w-5 text-yellow-500" />,
  'storms': <Wind className="h-5 w-5 text-gray-500" />,
  'sea-level-rise': <Waves className="h-5 w-5 text-blue-700" />,
  'wildfires': <Sun className="h-5 w-5 text-orange-500" />,
  'cold-waves': <Thermometer className="h-5 w-5 text-blue-300" />,
  'precipitation-changes': <CloudRain className="h-5 w-5 text-blue-400" />,
};

const hazardLabels: Record<ClimateHazard, string> = {
  'extreme-heat': 'Extreme Heat',
  'flooding': 'Flooding',
  'drought': 'Drought',
  'storms': 'Storms',
  'sea-level-rise': 'Sea Level Rise',
  'wildfires': 'Wildfires',
  'cold-waves': 'Cold Waves',
  'precipitation-changes': 'Precipitation Changes',
};

export function RiskClimate() {
  const [organizationContext, setOrganizationContext] = useState('');
  const [location, setLocation] = useState('');
  const [timeHorizon, setTimeHorizon] = useState<'short-term' | 'medium-term' | 'long-term'>('medium-term');
  const [risks, setRisks] = useState<ClimateRisk[]>([]);
  const [newRisk, setNewRisk] = useState({
    hazard: 'extreme-heat' as ClimateHazard,
    description: '',
    likelihood: 'possible' as Likelihood,
    consequence: 'moderate' as Consequence,
    measures: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addRisk = () => {
    if (!newRisk.description.trim()) return;

    const measures = newRisk.measures.split('\n').filter(m => m.trim());

    const risk: ClimateRisk = {
      id: `risk-${Date.now()}`,
      hazard: newRisk.hazard,
      description: newRisk.description,
      likelihood: newRisk.likelihood,
      consequence: newRisk.consequence,
      adaptationMeasures: measures,
    };

    setRisks(prev => [...prev, risk]);
    setNewRisk({
      hazard: 'extreme-heat',
      description: '',
      likelihood: 'possible',
      consequence: 'moderate',
      measures: '',
    });
  };

  const analyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const removeRisk = (id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
  };

  const hazards: ClimateHazard[] = [
    'extreme-heat', 'flooding', 'drought', 'storms', 
    'sea-level-rise', 'wildfires', 'cold-waves', 'precipitation-changes'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            Climate Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Organization Context</Label>
              <Textarea
                placeholder="Describe your organization and operations..."
                value={organizationContext}
                onChange={(e) => setOrganizationContext(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                placeholder="e.g., Southeast Asia, Coastal region"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Time Horizon</Label>
            <Select
              value={timeHorizon}
              onValueChange={(value) => setTimeHorizon(value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-term">Short-term (1-5 years)</SelectItem>
                <SelectItem value="medium-term">Medium-term (5-15 years)</SelectItem>
                <SelectItem value="long-term">Long-term (15-30 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

<Button onClick={analyze} disabled={!organizationContext.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </CardContent>
      </Card>

      {organizationContext && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Identify Climate Hazards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hazards.map(hazard => (
                  <div
                    key={hazard}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      newRisk.hazard === hazard ? 'border-green-500 bg-green-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setNewRisk(prev => ({ ...prev, hazard }))}
                  >
                    <div className="flex items-center gap-2">
                      {hazardIcons[hazard]}
                      <span className="text-sm font-medium">{hazardLabels[hazard]}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label>Risk Description</Label>
                <Textarea
                  placeholder="Describe the climate-related risk..."
                  value={newRisk.description}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="unlikely">Unlikely</SelectItem>
                      <SelectItem value="possible">Possible</SelectItem>
                      <SelectItem value="likely">Likely</SelectItem>
                      <SelectItem value="almost-certain">Almost Certain</SelectItem>
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
                      <SelectItem value="insignificant">Insignificant</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="catastrophic">Catastrophic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Adaptation Measures (one per line)</Label>
                <Textarea
                  placeholder="List adaptation measures..."
                  value={newRisk.measures}
                  onChange={(e) => setNewRisk(prev => ({ ...prev, measures: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={addRisk}
                disabled={!newRisk.description.trim()}
                className="w-full"
              >
                Add Risk
              </Button>
            </CardContent>
          </Card>

          {risks.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Identified Climate Risks ({risks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {risks.map((risk) => (
                      <div key={risk.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {hazardIcons[risk.hazard]}
                            <div>
                              <div className="font-medium">{hazardLabels[risk.hazard]}</div>
                              <div className="text-sm text-gray-600 mt-1">{risk.description}</div>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{risk.likelihood}</Badge>
                                <Badge variant="outline">{risk.consequence}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeRisk(risk.id)}>
                            ×
                          </Button>
                        </div>
                        {risk.adaptationMeasures.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm font-medium mb-2">Adaptation Measures:</div>
                            <ul className="space-y-1">
                              {risk.adaptationMeasures.map((measure, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {measure}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summary & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{risks.length}</div>
                      <div className="text-sm text-gray-600">Total Risks</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {risks.filter(r => r.likelihood === 'likely' || r.likelihood === 'almost-certain').length}
                      </div>
                      <div className="text-sm text-gray-600">High Likelihood</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {risks.filter(r => r.consequence === 'major' || r.consequence === 'catastrophic').length}
                      </div>
                      <div className="text-sm text-gray-600">Severe Impact</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <CheckCircle className="h-5 w-5" />
                      ISO 14001:2015 Compliance
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      This climate risk assessment supports compliance with ISO 14001:2015 clauses 6.1.1 (Actions to address risks and opportunities) and 8.2 (Emergency preparedness and response).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}

