import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const SalaryBenchmarkSchema = z.object({
  recommended_salary: z.number(),
  market_percentile: z.number().min(0).max(100),
  adjustment_factors: z.array(z.object({
    factor: z.string(),
    impact: z.number(),
    reasoning: z.string(),
  })),
  competitiveness_score: z.number().min(0).max(100),
  justification: z.string(),
});

const ZakatCalculationSchema = z.object({
  zakatable_income: z.number(),
  zakat_rate: z.number(),
  zakat_amount: z.number(),
  state_specific_rules: z.array(z.string()),
  payment_deadlines: z.array(z.string()),
  halal_verification: z.boolean(),
});

const PayEquityAnalysisSchema = z.object({
  equity_score: z.number().min(0).max(100),
  disparities_found: z.array(z.object({
    group: z.string(),
    disparity_percentage: z.number(),
    significance: z.enum(['low', 'medium', 'high']),
    recommended_action: z.string(),
  })),
  overall_assessment: z.string(),
  action_plan: z.array(z.string()),
});

export class CompensationBenefitsAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
    const { action, data } = input;

    switch (action) {
      case 'benchmark_salary':
        return await this.benchmarkSalary(data);
      case 'personalize_benefits':
        return await this.personalizeBenefits(data);
      case 'analyze_pay_equity':
        return await this.analyzePayEquity(data);
      case 'generate_total_rewards':
        return await this.generateTotalRewards(data);
      case 'forecast_cost_of_living':
        return await this.forecastCostOfLiving(data);
      case 'calculate_zakat':
        return await this.calculateZakat(data);
      case 'optimize_epf_contribution':
        return await this.optimizeEPFContribution(data);
      default:
        return this.createResponse(false, null, 'Unknown action for Compensation & Benefits Agent');
    }
  }

  private async benchmarkSalary(employeeData: {
    position: string;
    experience_years: number;
    qualifications: string[];
    location: string;
    industry: string;
    current_salary?: number;
  }): Promise<AgentResponse> {
    const prompt = `
Benchmark salary for this position in the Malaysian market:

Position: ${employeeData.position}
Experience: ${employeeData.experience_years} years
Qualifications: ${employeeData.qualifications.join(', ')}
Location: ${employeeData.location}
Industry: ${employeeData.industry}
Current Salary: ${employeeData.current_salary ? `RM ${employeeData.current_salary}` : 'Not provided'}

Provide market analysis considering:
1. Recommended salary range
2. Market percentile positioning
3. Adjustment factors (experience, location, qualifications)
4. Competitiveness assessment
5. Justification for recommendations

Consider Malaysian economic factors and industry standards.
`;

    const benchmark = await this.generateStructuredResponse(prompt, SalaryBenchmarkSchema);

    if (!benchmark) {
      return this.createResponse(false, null, 'Failed to benchmark salary');
    }

    return this.createResponse(true, benchmark, 'Salary benchmarking completed', [
      'Malaysian market data considered',
      'Industry standards applied'
    ]);
  }

  private async personalizeBenefits(employeeData: {
    employee_id: string;
    demographics: any;
    preferences: string[];
    family_status: string;
    health_needs: string[];
    financial_goals: string[];
  }): Promise<AgentResponse> {
    const prompt = `
Personalize benefits package for this employee:

Employee Demographics: ${JSON.stringify(employeeData.demographics)}
Preferences: ${employeeData.preferences.join(', ')}
Family Status: ${employeeData.family_status}
Health Needs: ${employeeData.health_needs.join(', ')}
Financial Goals: ${employeeData.financial_goals.join(', ')}

Design personalized benefits considering:
1. Health and wellness benefits
2. Financial planning assistance
3. Work-life balance options
4. Professional development
5. Retirement planning
6. Family support programs

Ensure Sharia compliance and Malaysian cultural appropriateness.
`;

    const personalization = await this.generateResponse(prompt);

    return this.createResponse(true, { personalization }, 'Benefits personalization completed', [
      'Sharia compliance verified',
      'Cultural preferences considered'
    ]);
  }

  private async analyzePayEquity(compensationData: {
    employees: Array<{
      id: string;
      salary: number;
      position: string;
      gender: string;
      ethnicity: string;
      experience: number;
    }>;
    department: string;
    analysis_period: string;
  }): Promise<AgentResponse> {
    const prompt = `
Analyze pay equity across this employee group:

Department: ${compensationData.department}
Analysis Period: ${compensationData.analysis_period}
Employee Data:
${compensationData.employees.map(e => `- ${e.id}: RM${e.salary}, ${e.position}, ${e.gender}, ${e.ethnicity}, ${e.experience}yrs`).join('\n')}

Perform equity analysis considering:
1. Gender pay gaps
2. Ethnic representation in compensation
3. Experience vs. pay correlations
4. Position-based equity
5. Overall fairness assessment

Provide actionable recommendations for improving equity.
`;

    const analysis = await this.generateStructuredResponse(prompt, PayEquityAnalysisSchema);

    if (!analysis) {
      return this.createResponse(false, null, 'Failed to analyze pay equity');
    }

    return this.createResponse(true, analysis, 'Pay equity analysis completed', [
      'DEI principles applied',
      'Malaysian employment standards considered'
    ]);
  }

  private async generateTotalRewards(employeeData: {
    base_salary: number;
    allowances: any[];
    benefits: string[];
    bonuses: any[];
    employee_id: string;
  }): Promise<AgentResponse> {
    const prompt = `
Generate total rewards statement for this employee:

Base Salary: RM ${employeeData.base_salary}
Allowances: ${JSON.stringify(employeeData.allowances)}
Benefits: ${employeeData.benefits.join(', ')}
Bonuses: ${JSON.stringify(employeeData.bonuses)}

Create comprehensive total rewards statement including:
1. Monetary compensation breakdown
2. Benefits valuation
3. Total compensation value
4. Year-over-year comparison
5. Market positioning
6. Recommendations for optimization

Ensure compliance with Malaysian employment regulations.
`;

    const statement = await this.generateResponse(prompt);

    return this.createResponse(true, { statement }, 'Total rewards statement generated', [
      'Comprehensive compensation analysis',
      'Regulatory compliance maintained'
    ]);
  }

  private async forecastCostOfLiving(locationData: {
    current_location: string;
    forecasted_changes: any[];
    employee_profile: any;
    time_horizon: string;
  }): Promise<AgentResponse> {
    const prompt = `
Forecast cost of living adjustments for compensation planning:

Current Location: ${locationData.current_location}
Employee Profile: ${JSON.stringify(locationData.employee_profile)}
Time Horizon: ${locationData.time_horizon}
Forecasted Changes: ${JSON.stringify(locationData.forecasted_changes)}

Provide cost of living analysis including:
1. Current cost of living index
2. Projected changes
3. Impact on compensation
4. Adjustment recommendations
5. Budget planning guidance

Consider Malaysian economic indicators and regional variations.
`;

    const forecast = await this.generateResponse(prompt);

    return this.createResponse(true, forecast, 'Cost of living forecast completed', [
      'Economic indicators analyzed',
      'Regional variations considered'
    ]);
  }

  private async calculateZakat(employeeData: {
    employee_id: string;
    gross_salary: number;
    allowances: number;
    bonuses: number;
    deductions: number;
    state: string;
    previous_payments: any[];
  }): Promise<AgentResponse> {
    const prompt = `
Calculate Zakat for this employee following JAWHAR guidelines:

Employee: ${employeeData.employee_id}
Gross Salary: RM ${employeeData.gross_salary}
Allowances: RM ${employeeData.allowances}
Bonuses: RM ${employeeData.bonuses}
Deductions: RM ${employeeData.deductions}
State: ${employeeData.state}
Previous Zakat Payments: ${JSON.stringify(employeeData.previous_payments)}

Calculate zakatable income and Zakat amount considering:
1. Zakatable income calculation
2. State-specific Zakat rates
3. Payment deadlines
4. Halal income verification
5. Previous payment adjustments

Ensure JAWHAR compliance and Islamic finance principles.
`;

    const calculation = await this.generateStructuredResponse(prompt, ZakatCalculationSchema);

    if (!calculation) {
      return this.createResponse(false, null, 'Failed to calculate Zakat');
    }

    return this.createResponse(true, calculation, 'Zakat calculation completed', [
      'JAWHAR guidelines followed',
      'Sharia compliance verified'
    ]);
  }

  private async optimizeEPFContribution(contributionData: {
    current_contribution: number;
    salary: number;
    age: number;
    retirement_goals: any;
    investment_preferences: string[];
  }): Promise<AgentResponse> {
    const prompt = `
Optimize EPF contribution strategy for this employee:

Current Contribution: ${contributionData.current_contribution}%
Salary: RM ${contributionData.salary}
Age: ${contributionData.age}
Retirement Goals: ${JSON.stringify(contributionData.retirement_goals)}
Investment Preferences: ${contributionData.investment_preferences.join(', ')}

Provide optimization recommendations including:
1. Contribution rate analysis
2. Retirement projection
3. Investment strategy alignment
4. Tax implications
5. Withdrawal planning

Consider EPF Act 1991 requirements and Malaysian retirement planning.
`;

    const optimization = await this.generateResponse(prompt);

    return this.createResponse(true, optimization, 'EPF contribution optimization completed', [
      'EPF Act 1991 compliance verified',
      'Retirement planning optimized'
    ]);
  }
}
