"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateMultiAgentSystem = demonstrateMultiAgentSystem;
const orchestrator_agent_1 = require("./orchestrator-agent");
async function demonstrateMultiAgentSystem() {
    console.log('🚀 AI-HRMS Multi-Agent System Demo');
    console.log('=====================================\n');
    const context = {
        language: 'en',
        compliance: true,
        tenantId: 'demo-company'
    };
    const orchestrator = new orchestrator_agent_1.OrchestratorAgent(context);
    console.log('Available AI Agents:');
    console.log('• Industrial Relations Agent - Dispute analysis, strike risk assessment');
    console.log('• Employee Relations Agent - Emotion detection, conflict mediation');
    console.log('• Foreign Workers Agent - Permit renewals, multi-language support');
    console.log('• Compensation & Benefits Agent - Salary benchmarking, Zakat calculations');
    console.log('• Talent Acquisition Agent - Resume parsing, candidate screening');
    console.log('• Learning & Development Agent - Skills gap analysis, learning paths');
    console.log('• Performance Management Agent - OKR tracking, feedback analysis');
    console.log('• HR Analytics Agent - Attrition prediction, workforce planning');
    console.log('• Orchestrator Agent - Multi-agent coordination\n');
    console.log('📋 Demo 1: Single Agent - Industrial Relations Dispute Analysis');
    console.log('----------------------------------------------------------------');
    const disputeData = {
        description: 'Workers complaining about unpaid overtime and unsafe working conditions',
        parties_involved: ['Production Workers Union', 'Management'],
        dispute_type: 'Working Conditions',
        timeline: 'Ongoing for 3 weeks'
    };
    try {
        const disputeResult = await orchestrator.execute({
            action: 'analyze_dispute',
            data: disputeData
        });
        console.log('✅ Dispute Analysis Result:');
        console.log(`Success: ${disputeResult.success}`);
        console.log(`Message: ${disputeResult.message}`);
        console.log(`Compliance Notes: ${disputeResult.compliance_notes?.join(', ')}\n`);
    }
    catch (error) {
        console.error('❌ Dispute analysis failed:', error);
    }
    console.log('👥 Demo 2: Multi-Agent - Employee Lifecycle Orchestration');
    console.log('-------------------------------------------------------');
    const employeeData = {
        employee_id: 'EMP001',
        position: 'Software Engineer',
        department: 'IT',
        nationality: 'Malaysian',
        join_date: '2024-01-15',
        salary: 5000,
        location: 'Kuala Lumpur'
    };
    try {
        const lifecycleResult = await orchestrator.orchestrateEmployeeLifecycle(employeeData);
        console.log('✅ Employee Lifecycle Orchestration Result:');
        console.log(`Success: ${lifecycleResult.success}`);
        console.log(`Message: ${lifecycleResult.message}`);
        console.log(`Compliance Notes: ${lifecycleResult.compliance_notes?.join(', ')}\n`);
    }
    catch (error) {
        console.error('❌ Employee lifecycle orchestration failed:', error);
    }
    console.log('⚖️ Demo 3: Multi-Agent - Compliance Audit');
    console.log('----------------------------------------');
    const auditData = {
        organization_size: 150,
        industry: 'Manufacturing',
        recent_audits: [
            { type: 'EPF Compliance', date: '2024-01-01', status: 'Passed' },
            { type: 'PDPA Audit', date: '2023-12-15', status: 'Minor Issues' }
        ],
        regulatory_changes: ['New PDPA guidelines', 'Updated EPF contribution rates'],
        compliance_areas: ['Employment Act', 'PDPA', 'EPF/SOCSO', 'Zakat']
    };
    try {
        const auditResult = await orchestrator.orchestrateComplianceAudit(auditData);
        console.log('✅ Compliance Audit Result:');
        console.log(`Success: ${auditResult.success}`);
        console.log(`Message: ${auditResult.message}`);
        console.log(`Compliance Notes: ${auditResult.compliance_notes?.join(', ')}\n`);
    }
    catch (error) {
        console.error('❌ Compliance audit failed:', error);
    }
    console.log('📊 Demo 4: Multi-Agent - Workforce Planning');
    console.log('-------------------------------------------');
    const planningData = {
        department: 'Engineering',
        current_headcount: 25,
        business_goals: ['Digital transformation', 'Product expansion'],
        market_trends: { tech_demand: 'high', local_talent: 'competitive' },
        budget_constraints: 500000,
        skill_requirements: [
            { skill: 'React/TypeScript', current: 15, required: 20 },
            { skill: 'Cloud Architecture', current: 8, required: 15 },
            { skill: 'AI/ML', current: 3, required: 8 }
        ]
    };
    try {
        const planningResult = await orchestrator.orchestrateWorkforcePlanning(planningData);
        console.log('✅ Workforce Planning Result:');
        console.log(`Success: ${planningResult.success}`);
        console.log(`Message: ${planningResult.message}`);
        console.log(`Compliance Notes: ${planningResult.compliance_notes?.join(', ')}\n`);
    }
    catch (error) {
        console.error('❌ Workforce planning failed:', error);
    }
    console.log('🎉 Multi-Agent System Demo Complete!');
    console.log('=====================================');
    console.log('\nKey Features Demonstrated:');
    console.log('• Intelligent agent orchestration');
    console.log('• Malaysian regulatory compliance');
    console.log('• Multi-language and cultural support');
    console.log('• Islamic finance integration');
    console.log('• Real-time AI-powered insights');
    console.log('• Automated workflow coordination');
}
if (require.main === module) {
    demonstrateMultiAgentSystem().catch(console.error);
}
//# sourceMappingURL=demo.js.map