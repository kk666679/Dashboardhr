export class ComplianceScoringEngine {
  calculateMaturityLevel(score: number): { level: number; label: string; description: string } {
    if (score < 20) return { level: 0, label: 'Not Implemented', description: 'No evidence of implementation' };
    if (score < 40) return { level: 1, label: 'Initial', description: 'Ad-hoc processes, inconsistent' };
    if (score < 60) return { level: 2, label: 'Managed', description: 'Documented processes, some consistency' };
    if (score < 80) return { level: 3, label: 'Defined', description: 'Standardized processes, well documented' };
    if (score < 95) return { level: 4, label: 'Quantitatively Managed', description: 'Measured and controlled' };
    return { level: 5, label: 'Optimized', description: 'Continuous improvement, best practice' };
  }

  scoreCompliance(requirements: Array<{ requirement: string; implemented: boolean; evidence: string[] }>) {
    const total = requirements.length;
    const implemented = requirements.filter(r => r.implemented).length;
    const percentage = (implemented / total) * 100;
    const maturity = this.calculateMaturityLevel(percentage);

    return {
      totalRequirements: total,
      implementedRequirements: implemented,
      compliancePercentage: percentage,
      maturityLevel: maturity,
      gaps: requirements.filter(r => !r.implemented).map(r => r.requirement),
    };
  }

  generateGapAnalysis(current: number, target: number) {
    const gap = target - current;
    return {
      currentScore: current,
      targetScore: target,
      gap,
      recommendations: gap > 20 ? [
        'Conduct comprehensive gap assessment',
        'Develop implementation roadmap',
        'Allocate resources for improvement',
        'Establish monitoring mechanisms',
      ] : [
        'Focus on specific improvement areas',
        'Enhance documentation',
        'Strengthen monitoring processes',
      ],
    };
  }
}

export const complianceScoringEngine = new ComplianceScoringEngine();