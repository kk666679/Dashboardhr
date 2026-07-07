/**
 * Risk Engine - ISO Risk Assessment with 5x5 Risk Matrix
 * Provides comprehensive risk assessment capabilities for QMS, EMS, and OH&S
 */

import { z } from 'zod';

// Risk Assessment Types
export const RiskCategorySchema = z.enum(['quality', 'environmental', 'safety', 'operational', 'strategic', 'compliance']);
export const RiskLevelSchema = z.enum(['very_low', 'low', 'medium', 'high', 'very_high']);
export const LikelihoodSchema = z.enum(['rare', 'unlikely', 'possible', 'likely', 'certain']);
export const SeveritySchema = z.enum(['negligible', 'minor', 'moderate', 'major', 'catastrophic']);

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: z.infer<typeof RiskCategorySchema>;
  likelihood: z.infer<typeof LikelihoodSchema>;
  severity: z.infer<typeof SeveritySchema>;
  inherentRisk: number;
  residualRisk: number;
  currentControls: string[];
  riskTreatment: 'accept' | 'mitigate' | 'transfer' | 'avoid';
  owner: string;
  dueDate?: string;
  status: 'identified' | 'in_progress' | 'controlled' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface RiskMatrixCell {
  likelihood: z.infer<typeof LikelihoodSchema>;
  severity: z.infer<typeof SeveritySchema>;
  score: number;
  level: z.infer<typeof RiskLevelSchema>;
  color: string;
  action: string;
}

// 5x5 Risk Matrix Configuration
export const riskMatrix: RiskMatrixCell[][] = [
  // Negligible severity (1)
  [
    { likelihood: 'rare', severity: 'negligible', score: 1, level: 'very_low', color: '#22c55e', action: 'Accept' },
    { likelihood: 'unlikely', severity: 'negligible', score: 2, level: 'very_low', color: '#22c55e', action: 'Accept' },
    { likelihood: 'possible', severity: 'negligible', score: 3, level: 'low', color: '#84cc16', action: 'Accept' },
    { likelihood: 'likely', severity: 'negligible', score: 4, level: 'low', color: '#84cc16', action: 'Monitor' },
    { likelihood: 'certain', severity: 'negligible', score: 5, level: 'medium', color: '#eab308', action: 'Monitor' },
  ],
  // Minor severity (2)
  [
    { likelihood: 'rare', severity: 'minor', score: 2, level: 'very_low', color: '#22c55e', action: 'Accept' },
    { likelihood: 'unlikely', severity: 'minor', score: 4, level: 'low', color: '#84cc16', action: 'Monitor' },
    { likelihood: 'possible', severity: 'minor', score: 6, level: 'medium', color: '#eab308', action: 'Mitigate' },
    { likelihood: 'likely', severity: 'minor', score: 8, level: 'medium', color: '#eab308', action: 'Mitigate' },
    { likelihood: 'certain', severity: 'minor', score: 10, level: 'high', color: '#f97316', action: 'Mitigate' },
  ],
  // Moderate severity (3)
  [
    { likelihood: 'rare', severity: 'moderate', score: 3, level: 'low', color: '#84cc16', action: 'Monitor' },
    { likelihood: 'unlikely', severity: 'moderate', score: 6, level: 'medium', color: '#eab308', action: 'Mitigate' },
    { likelihood: 'possible', severity: 'moderate', score: 9, level: 'high', color: '#f97316', action: 'Mitigate' },
    { likelihood: 'likely', severity: 'moderate', score: 12, level: 'high', color: '#f97316', action: 'Mitigate' },
    { likelihood: 'certain', severity: 'moderate', score: 15, level: 'very_high', color: '#ef4444', action: 'Avoid/Mitigate' },
  ],
  // Major severity (4)
  [
    { likelihood: 'rare', severity: 'major', score: 4, level: 'low', color: '#84cc16', action: 'Monitor' },
    { likelihood: 'unlikely', severity: 'major', score: 8, level: 'medium', color: '#eab308', action: 'Mitigate' },
    { likelihood: 'possible', severity: 'major', score: 12, level: 'high', color: '#f97316', action: 'Mitigate' },
    { likelihood: 'likely', severity: 'major', score: 16, level: 'very_high', color: '#ef4444', action: 'Avoid/Transfer' },
    { likelihood: 'certain', severity: 'major', score: 20, level: 'very_high', color: '#ef4444', action: 'Avoid' },
  ],
  // Catastrophic severity (5)
  [
    { likelihood: 'rare', severity: 'catastrophic', score: 5, level: 'medium', color: '#eab308', action: 'Mitigate' },
    { likelihood: 'unlikely', severity: 'catastrophic', score: 10, level: 'high', color: '#f97316', action: 'Mitigate' },
    { likelihood: 'possible', severity: 'catastrophic', score: 15, level: 'very_high', color: '#ef4444', action: 'Avoid/Transfer' },
    { likelihood: 'likely', severity: 'catastrophic', score: 20, level: 'very_high', color: '#ef4444', action: 'Avoid' },
    { likelihood: 'certain', severity: 'catastrophic', score: 25, level: 'very_high', color: '#991b1b', action: 'Avoid' },
  ],
];

// Helper functions
function getLikelihoodScore(likelihood: z.infer<typeof LikelihoodSchema>): number {
  const scores: Record<z.infer<typeof LikelihoodSchema>, number> = {
    rare: 1,
    unlikely: 2,
    possible: 3,
    likely: 4,
    certain: 5,
  };
  return scores[likelihood];
}

function getSeverityScore(severity: z.infer<typeof SeveritySchema>): number {
  const scores: Record<z.infer<typeof SeveritySchema>, number> = {
    negligible: 1,
    minor: 2,
    moderate: 3,
    major: 4,
    catastrophic: 5,
  };
  return scores[severity];
}

export function calculateInherentRisk(
  likelihood: z.infer<typeof LikelihoodSchema>,
  severity: z.infer<typeof SeveritySchema>
): number {
  return getLikelihoodScore(likelihood) * getSeverityScore(severity);
}

export function calculateResidualRisk(
  inherentRisk: number,
  controlEffectiveness: number // 0-1 scale
): number {
  return Math.round(inherentRisk * (1 - controlEffectiveness));
}

export function getRiskLevel(score: number): z.infer<typeof RiskLevelSchema> {
  if (score <= 4) return 'very_low';
  if (score <= 9) return 'low';
  if (score <= 14) return 'medium';
  if (score <= 19) return 'high';
  return 'very_high';
}

export function getRiskMatrixCell(
  likelihood: z.infer<typeof LikelihoodSchema>,
  severity: z.infer<typeof SeveritySchema>
): RiskMatrixCell {
  const row = getSeverityScore(severity) - 1;
  const col = getLikelihoodScore(likelihood) - 1;
  return riskMatrix[row][col];
}

// Main Risk Engine Class
export class RiskEngine {
  private risks: Risk[] = [];

  constructor() {
    this.risks = [];
  }

  addRisk(risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'inherentRisk' | 'residualRisk'>): Risk {
    const inherentRisk = calculateInherentRisk(risk.likelihood, risk.severity);
    const newRisk: Risk = {
      ...risk,
      id: `RISK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      inherentRisk,
      residualRisk: inherentRisk, // Initially same as inherent
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.risks.push(newRisk);
    return newRisk;
  }

  updateRisk(id: string, updates: Partial<Risk>): Risk | null {
    const index = this.risks.findIndex(r => r.id === id);
    if (index === -1) return null;

    const risk = this.risks[index];
    const updatedRisk = { ...risk, ...updates, updatedAt: new Date().toISOString() };

    // Recalculate if likelihood or severity changed
    if (updates.likelihood || updates.severity) {
      updatedRisk.inherentRisk = calculateInherentRisk(
        updatedRisk.likelihood,
        updatedRisk.severity
      );
    }

    this.risks[index] = updatedRisk;
    return updatedRisk;
  }

  applyControls(id: string, controlEffectiveness: number): Risk | null {
    const risk = this.risks.find(r => r.id === id);
    if (!risk) return null;

    risk.residualRisk = calculateResidualRisk(risk.inherentRisk, controlEffectiveness);
    risk.status = 'controlled';
    risk.updatedAt = new Date().toISOString();
    return risk;
  }

  getRisks(filters?: {
    category?: z.infer<typeof RiskCategorySchema>;
    level?: z.infer<typeof RiskLevelSchema>;
    status?: Risk['status'];
  }): Risk[] {
    let filtered = [...this.risks];

    if (filters?.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters?.level) {
      filtered = filtered.filter(r => getRiskLevel(r.residualRisk) === filters.level);
    }
    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    return filtered;
  }

  getRiskSummary(): {
    total: number;
    byLevel: Record<z.infer<typeof RiskLevelSchema>, number>;
    byCategory: Record<z.infer<typeof RiskCategorySchema>, number>;
    byStatus: Record<Risk['status'], number>;
    averageInherent: number;
    averageResidual: number;
  } {
    const byLevel: Record<z.infer<typeof RiskLevelSchema>, number> = {
      very_low: 0,
      low: 0,
      medium: 0,
      high: 0,
      very_high: 0,
    };
    const byCategory: Record<z.infer<typeof RiskCategorySchema>, number> = {
      quality: 0,
      environmental: 0,
      safety: 0,
      operational: 0,
      strategic: 0,
      compliance: 0,
    };
    const byStatus: Record<Risk['status'], number> = {
      identified: 0,
      in_progress: 0,
      controlled: 0,
      closed: 0,
    };

    let totalInherent = 0;
    let totalResidual = 0;

    this.risks.forEach(risk => {
      byLevel[getRiskLevel(risk.inherentRisk)]++;
      byCategory[risk.category]++;
      byStatus[risk.status]++;
      totalInherent += risk.inherentRisk;
      totalResidual += risk.residualRisk;
    });

    return {
      total: this.risks.length,
      byLevel,
      byCategory,
      byStatus,
      averageInherent: this.risks.length ? totalInherent / this.risks.length : 0,
      averageResidual: this.risks.length ? totalResidual / this.risks.length : 0,
    };
  }

  generateRiskReport(): string {
    const summary = this.getRiskSummary();
    const highRisks = this.getRisks({ level: 'high' }).concat(this.getRisks({ level: 'very_high' }));

    let report = `# Risk Assessment Report\n\n`;
    report += `## Summary\n`;
    report += `- Total Risks: ${summary.total}\n`;
    report += `- Average Inherent Risk: ${summary.averageInherent.toFixed(1)}\n`;
    report += `- Average Residual Risk: ${summary.averageResidual.toFixed(1)}\n\n`;

    report += `## Risk Distribution by Level\n`;
    Object.entries(summary.byLevel).forEach(([level, count]) => {
      report += `- ${level}: ${count}\n`;
    });
    report += `\n`;

    report += `## High Priority Risks Requiring Action\n`;
    highRisks.forEach(risk => {
      report += `### ${risk.id}: ${risk.title}\n`;
      report += `- Level: ${getRiskLevel(risk.residualRisk)}\n`;
      report += `- Owner: ${risk.owner}\n`;
      report += `- Treatment: ${risk.riskTreatment}\n\n`;
    });

    return report;
  }

  clearRisks(): void {
    this.risks = [];
  }
}

// Export singleton instance
export const riskEngine = new RiskEngine();

// Export tool functions for use in agents
export const riskEngineTools = {
  calculateInherentRisk,
  calculateResidualRisk,
  getRiskLevel,
  getRiskMatrixCell,
  riskMatrix,
};

