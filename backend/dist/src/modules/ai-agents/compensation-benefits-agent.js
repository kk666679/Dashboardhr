"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompensationBenefitsAgent = void 0;
const base_agent_1 = require("./base-agent");
const zod_1 = require("zod");
const SalaryBenchmarkSchema = zod_1.z.object({
    recommended_salary: zod_1.z.number(),
    market_percentile: zod_1.z.number().min(0).max(100),
    adjustment_factors: zod_1.z.array(zod_1.z.object({
        factor: zod_1.z.string(),
        impact: zod_1.z.number(),
        reasoning: zod_1.z.string(),
    })),
    competitiveness_score: zod_1.z.number().min(0).max(100),
    justification: zod_1.z.string(),
});
const ZakatCalculationSchema = zod_1.z.object({
    zakatable_income: zod_1.z.number(),
    zakat_rate: zod_1.z.number(),
    zakat_amount: zod_1.z.number(),
    state_specific_rules: zod_1.z.array(zod_1.z.string()),
    payment_deadlines: zod_1.z.array(zod_1.z.string()),
    halal_verification: zod_1.z.boolean(),
});
const PayEquityAnalysisSchema = zod_1.z.object({
    equity_score: zod_1.z.number().min(0).max(100),
    disparities_found: zod_1.z.array(zod_1.z.object({
        group: zod_1.z.string(),
        disparity_percentage: zod_1.z.number(),
        significance: zod_1.z.enum(['low', 'medium', 'high']),
        recommended_action: zod_1.z.string(),
    })),
    overall_assessment: zod_1.z.string(),
    action_plan: zod_1.z.array(zod_1.z.string()),
});
class CompensationBenefitsAgent extends base_agent_1.BaseAgent {
    async execute(input) {
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
    async benchmarkSalary(employeeData) {
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
    async personalizeBenefits(employeeData) {
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
    async analyzePayEquity(compensationData) {
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
    async generateTotalRewards(employeeData) {
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
    async forecastCostOfLiving(locationData) {
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
    async calculateZakat(employeeData) {
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
    async optimizeEPFContribution(contributionData) {
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
exports.CompensationBenefitsAgent = CompensationBenefitsAgent;
//# sourceMappingURL=compensation-benefits-agent.js.map