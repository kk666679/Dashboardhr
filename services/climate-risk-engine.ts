/**
 * Climate Risk Engine - ISO 14001 AMD.1:2024 Climate Change Adaptation
 * Provides climate risk assessment capabilities aligned with ISO 14001:2015 AMD.1:2024
 */

import { z } from 'zod';

// Climate Risk Types
export const ClimateHazardCategorySchema = z.enum([
  'temperature_extreme',
  'precipitation_extreme',
  'wind_extreme',
  'sea_level_rise',
  'water_scarcity',
  'ecosystem_disruption'
]);

export const ClimateRiskCategorySchema = z.enum(['physical', 'transition', 'liability']);
export const TimeHorizonSchema = z.enum(['short', 'medium', 'long']);
export const VulnerabilitySchema = z.enum(['low', 'moderate', 'high', 'very_high']);
export const ClimateLikelihoodSchema = z.enum(['unlikely', 'possible', 'likely', 'very_likely']);

export interface ClimateRisk {
  id: string;
  name: string;
  category: z.infer<typeof ClimateRiskCategorySchema>;
  hazardCategory: z.infer<typeof ClimateHazardCategorySchema>;
  description: string;
  likelihood: z.infer<typeof ClimateLikelihoodSchema>;
  severity: z.infer<typeof VulnerabilitySchema>;
  score: number;
  timeHorizon: z.infer<typeof TimeHorizonSchema>;
  adaptiveCapacity: z.infer<typeof VulnerabilitySchema>;
  vulnerabilityRating: z.infer<typeof VulnerabilitySchema>;
  currentControls: string[];
  adaptationOptions: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  status: 'identified' | 'assessing' | 'planning' | 'implementing' | 'completed';
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Climate Risk Score Functions
function getClimateScore(likelihood: z.infer<typeof ClimateLikelihoodSchema>, severity: z.infer<typeof VulnerabilitySchema>): number {
  const likelihoodScores: Record<string, number> = { unlikely: 1, possible: 2, likely: 3, very_likely: 4 };
  const severityScores: Record<string, number> = { low: 1, moderate: 2, high: 3, very_high: 4 };
  return likelihoodScores[likelihood] * severityScores[severity];
}

function getVulnerabilityRating(severity: z.infer<typeof VulnerabilitySchema>, adaptiveCapacity: z.infer<typeof VulnerabilitySchema>): z.infer<typeof VulnerabilitySchema> {
  const severityScores: Record<string, number> = { low: 1, moderate: 2, high: 3, very_high: 4 };
  const capacityScores: Record<string, number> = { low: 4, moderate: 3, high: 2, very_high: 1 };
  const combinedScore = severityScores[severity] + capacityScores[adaptiveCapacity];
  if (combinedScore <= 3) return 'low';
  if (combinedScore <= 5) return 'moderate';
  if (combinedScore <= 7) return 'high';
  return 'very_high';
}

function getPriority(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score <= 4) return 'low';
  if (score <= 8) return 'medium';
  if (score <= 12) return 'high';
  return 'critical';
}

// Pre-defined climate hazards
export const climateHazards = [
  { id: 'CH-001', name: 'Extreme heat waves', category: 'physical' as const, hazardCategory: 'temperature_extreme' as const, description: 'Increased frequency and intensity of heat waves', adaptationOptions: ['Cooling systems', 'Work schedule modifications', 'Heat stress training'] },
  { id: 'CH-002', name: 'Extreme cold events', category: 'physical' as const, hazardCategory: 'temperature_extreme' as const, description: 'More frequent cold spells', adaptationOptions: ['Heating systems', 'Insulation upgrades'] },
  { id: 'CH-003', name: 'Changing temperature patterns', category: 'physical' as const, hazardCategory: 'temperature_extreme' as const, description: 'Shifts in seasonal temperature patterns', adaptationOptions: ['Climate monitoring', 'Operational adjustments'] },
  { id: 'CH-004', name: 'Increased precipitation', category: 'physical' as const, hazardCategory: 'precipitation_extreme' as const, description: 'Higher rainfall intensity', adaptationOptions: ['Drainage systems', 'Flood barriers'] },
  { id: 'CH-005', name: 'Drought conditions', category: 'physical' as const, hazardCategory: 'precipitation_extreme' as const, description: 'Extended periods of low rainfall', adaptationOptions: ['Water storage', 'Recycling systems'] },
  { id: 'CH-006', name: 'River flooding', category: 'physical' as const, hazardCategory: 'precipitation_extreme' as const, description: 'River overflow and flash flooding', adaptationOptions: ['Flood barriers', 'Evacuation plans'] },
  { id: 'CH-007', name: 'Stronger storms', category: 'physical' as const, hazardCategory: 'wind_extreme' as const, description: 'More intense wind events', adaptationOptions: ['Building reinforcement', 'Storm shutters'] },
  { id: 'CH-008', name: 'Sea level rise', category: 'physical' as const, hazardCategory: 'sea_level_rise' as const, description: 'Rising sea levels affecting coastal operations', adaptationOptions: ['Coastal defenses', 'Relocation planning'] },
  { id: 'CH-009', name: 'Water scarcity', category: 'physical' as const, hazardCategory: 'water_scarcity' as const, description: 'Reduced water availability', adaptationOptions: ['Water recycling', 'Rainwater harvesting'] },
  { id: 'CH-010', name: 'Carbon pricing', category: 'transition' as const, hazardCategory: 'temperature_extreme' as const, description: 'Increased costs from carbon pricing', adaptationOptions: ['Energy efficiency', 'Renewable energy'] },
  { id: 'CH-011', name: 'Climate regulations', category: 'transition' as const, hazardCategory: 'temperature_extreme' as const, description: 'New climate-related legal requirements', adaptationOptions: ['Compliance monitoring', 'Legal review'] },
  { id: 'CH-012', name: 'Climate litigation', category: 'liability' as const, hazardCategory: 'temperature_extreme' as const, description: 'Legal action for climate impacts', adaptationOptions: ['Legal compliance', 'Risk assessment'] },
];

// Climate Risk Engine Class
export class ClimateRiskEngine {
  private risks: ClimateRisk[] = [];

  constructor() {
    this.risks = [];
  }

  addRisk(hazardId: string, customFields: Partial<ClimateRisk> = {}): ClimateRisk | null {
    const hazard = climateHazards.find(h => h.id === hazardId);
    if (!hazard) return null;

    const likelihood = customFields.likelihood || 'likely';
    const severity = customFields.severity || 'moderate';
    const adaptiveCapacity = customFields.adaptiveCapacity || 'moderate';

    const score = getClimateScore(likelihood, severity);
    const vulnerabilityRating = getVulnerabilityRating(severity, adaptiveCapacity);

    const newRisk: ClimateRisk = {
      id: `CLR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: hazard.name,
      category: hazard.category,
      hazardCategory: hazard.hazardCategory,
      description: customFields.description || hazard.description,
      likelihood,
      severity,
      score,
      timeHorizon: customFields.timeHorizon || 'medium',
      adaptiveCapacity,
      vulnerabilityRating,
      currentControls: customFields.currentControls || [],
      adaptationOptions: customFields.adaptationOptions || hazard.adaptationOptions,
      priority: getPriority(score),
      owner: customFields.owner || 'Environmental Manager',
      status: 'identified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.risks.push(newRisk);
    return newRisk;
  }

  addCustomRisk(risk: Omit<ClimateRisk, 'id' | 'createdAt' | 'updatedAt' | 'score' | 'vulnerabilityRating' | 'priority'>): ClimateRisk {
    const score = getClimateScore(risk.likelihood, risk.severity);
    const vulnerabilityRating = getVulnerabilityRating(risk.severity, risk.adaptiveCapacity);

    const newRisk: ClimateRisk = {
      ...risk,
      id: `CLR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      score,
      vulnerabilityRating,
      priority: getPriority(score),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.risks.push(newRisk);
    return newRisk;
  }

  updateRisk(id: string, updates: Partial<ClimateRisk>): ClimateRisk | null {
    const index = this.risks.findIndex(r => r.id === id);
    if (index === -1) return null;

    const risk = this.risks[index];
    const updatedRisk = { ...risk, ...updates, updatedAt: new Date().toISOString() };

    if (updates.likelihood || updates.severity || updates.adaptiveCapacity) {
      updatedRisk.score = getClimateScore(updatedRisk.likelihood, updatedRisk.severity);
      updatedRisk.vulnerabilityRating = getVulnerabilityRating(updatedRisk.severity, updatedRisk.adaptiveCapacity);
      updatedRisk.priority = getPriority(updatedRisk.score);
    }

    this.risks[index] = updatedRisk;
    return updatedRisk;
  }

  getRisks(filters?: { category?: string; priority?: string; timeHorizon?: string; status?: string }): ClimateRisk[] {
    let filtered = [...this.risks];
    if (filters?.category) filtered = filtered.filter(r => r.category === filters.category);
    if (filters?.priority) filtered = filtered.filter(r => r.priority === filters.priority);
    if (filters?.timeHorizon) filtered = filtered.filter(r => r.timeHorizon === filters.timeHorizon);
    if (filters?.status) filtered = filtered.filter(r => r.status === filters.status);
    return filtered;
  }

  getRiskSummary(): { total: number; byCategory: Record<string, number>; byPriority: Record<string, number>; criticalRisks: number; highRisks: number } {
    const byCategory: Record<string, number> = { physical: 0, transition: 0, liability: 0 };
    const byPriority: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };

    this.risks.forEach(risk => {
      byCategory[risk.category]++;
      byPriority[risk.priority]++;
    });

    return { total: this.risks.length, byCategory, byPriority, criticalRisks: byPriority.critical, highRisks: byPriority.high };
  }

  getAvailableHazards(): typeof climateHazards {
    return climateHazards;
  }

  generateClimateAdaptationPlan(): string {
    const summary = this.getRiskSummary();
    const criticalRisks = this.getRisks({ priority: 'critical' });

    let plan = `# Climate Change Adaptation Plan\n## Per ISO 14001:2015 AMD.1:2024\n\n### Summary\n- Total Risks: ${summary.total} | Critical: ${summary.criticalRisks} | High: ${summary.highRisks}\n\n### Priority Actions\n`;
    criticalRisks.forEach(risk => {
      plan += `**${risk.name}** (${risk.timeHorizon})\n- ${risk.description}\n- Owner: ${risk.owner}\n- Actions: ${risk.adaptationOptions.join(', ')}\n\n`;
    });
    return plan;
  }

  clearRisks(): void {
    this.risks = [];
  }
}

export const climateRiskEngine = new ClimateRiskEngine();

export const climateRiskTools = { getClimateScore, getVulnerabilityRating, getPriority, climateHazards };
