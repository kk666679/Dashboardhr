"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentCoordinatorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orchestrator_agent_1 = require("../src/modules/ai-agents/orchestrator-agent");
let AiAgentCoordinatorController = class AiAgentCoordinatorController {
    constructor() {
        const context = {
            language: 'en',
            compliance: true,
            tenantId: 'default'
        };
        this.orchestrator = new orchestrator_agent_1.OrchestratorAgent(context);
    }
    getIndustrialRelations() {
        return {
            features: [
                'Dispute resolution prediction engine (92% accuracy)',
                'Collective agreement analyzer with NLP',
                'Strike risk assessment using sentiment analysis',
                'Automated case documentation with audit trails',
                'Legal precedent database for Malaysian labor courts'
            ],
            compliance: [
                'Industrial Relations Act 1967 enforcement',
                'Trade Union Act 1959 compliance checks',
                'Automated Form 34 submission for disputes'
            ]
        };
    }
    getEmployeeRelations() {
        return {
            features: [
                'Emotion detection in employee feedback',
                'Conflict mediation chatbot (BM/English)',
                'Culture health dashboard with DEI metrics',
                'ER case prediction based on behavioral patterns',
                'Automated investigation documentation'
            ],
            compliance: [
                'Employment Act 1955 violation detection',
                'Automated harassment case protocols',
                'PDPA-compliant case documentation'
            ]
        };
    }
    getForeignWorkersManagement() {
        return {
            features: [
                'Automated permit renewal predictions',
                'Compliance risk assessment for foreign workers',
                'Multi-language worker communication (Bengali, Nepali, Indonesian)',
                'Recruitment agency performance analytics',
                'Levy calculation optimization'
            ],
            compliance: [
                'Work Permit Tracking - Employment Pass, Work Permit monitoring',
                'FOMEMA Integration - Medical screening automation',
                'Immigration API - Real-time status checks',
                'MOHR/JTK Monitoring - Labor regulation compliance'
            ]
        };
    }
    getCompensationBenefits() {
        return {
            features: [
                'Real-time market salary benchmarking',
                'Benefits personalization engine',
                'Pay equity analysis across demographics',
                'Total rewards statement generator',
                'Cost-of-living adjustment forecaster'
            ],
            compliance: [
                'PCB Engine - Auto-tax calculations with LHDN rates',
                'Zakat Hub - State-specific zakat calculations',
                'TH Integration - Hajj savings management',
                'EPF Optimizer - Contribution forecasting & optimization'
            ]
        };
    }
    getTalentAcquisition() {
        return {
            features: [
                'Resume parsing with Malaysian context (degrees, certifications)',
                'AI-powered candidate screening',
                'Interview analytics & bias detection',
                'Predictive quality-of-hire modeling',
                'Automated candidate engagement chatbot'
            ],
            compliance: [
                'Bahasa Malaysia NLP processing',
                'Local university/skill recognition (UiTM, UM, USM, etc.)',
                'Cultural fit analysis for Malaysian workplace',
                'Automated employment pass processing',
                'MYWorkID verification integration'
            ]
        };
    }
    getLearningDevelopment() {
        return {
            features: [
                'Skills gap identification engine',
                'Personalized learning path creation',
                'Micro-learning recommendation system',
                'Training ROI prediction models',
                'AR/VR competency simulations'
            ],
            compliance: [
                'HRDF claim automation',
                'Training compliance tracking',
                'Certification expiry alerts',
                'Bumiputera development programs'
            ]
        };
    }
    getPerformanceManagement() {
        return {
            features: [
                'OKR tracking with predictive analytics',
                '360° feedback sentiment analysis',
                'Performance-potential matrix (9-box grid)',
                'Career path simulation engine',
                'Bias detection in evaluations'
            ],
            compliance: [
                'MSC Malaysia performance standards',
                'GLC transformation initiative alignment',
                'Productivity Nexus (MPC) metrics',
                'National Key Economic Area (NKEA) KPIs'
            ]
        };
    }
    getHrAnalytics() {
        return {
            features: [
                'Attrition risk prediction',
                'Workforce planning simulation',
                'Compliance health assessment',
                'Culture metrics analysis',
                'ROI calculations for HR investments'
            ],
            reports: [
                'EPF/SOCSO monthly submissions',
                'Bursa Malaysia ESG reporting',
                'HRDF utilization analytics',
                'DEI reporting for government tenders',
                'TalentCorp mobility statistics'
            ]
        };
    }
    async coordinateAgents(body) {
        try {
            const { task, module, data = {}, multi_agent = false } = body;
            const result = await this.orchestrator.execute({
                action: task,
                data: { ...data, module },
                multi_agent
            });
            return {
                success: result.success,
                response: result.data,
                message: result.message,
                compliance_notes: result.compliance_notes,
                confidence_score: result.confidence_score,
                orchestration_metadata: result.orchestration_metadata
            };
        }
        catch (error) {
            console.error('Agent coordination error:', error);
            return {
                success: false,
                message: 'Failed to coordinate AI agents',
                error: error.message
            };
        }
    }
    async orchestrateEmployeeLifecycle(body) {
        try {
            const result = await this.orchestrator.orchestrateEmployeeLifecycle(body.employeeData);
            return {
                success: result.success,
                response: result.data,
                message: result.message,
                compliance_notes: result.compliance_notes
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Employee lifecycle orchestration failed',
                error: error.message
            };
        }
    }
    async orchestrateComplianceAudit(body) {
        try {
            const result = await this.orchestrator.orchestrateComplianceAudit(body.auditData);
            return {
                success: result.success,
                response: result.data,
                message: result.message,
                compliance_notes: result.compliance_notes
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Compliance audit orchestration failed',
                error: error.message
            };
        }
    }
    async orchestrateWorkforcePlanning(body) {
        try {
            const result = await this.orchestrator.orchestrateWorkforcePlanning(body.planningData);
            return {
                success: result.success,
                response: result.data,
                message: result.message,
                compliance_notes: result.compliance_notes
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Workforce planning orchestration failed',
                error: error.message
            };
        }
    }
    async orchestratePerformanceReview(body) {
        try {
            const result = await this.orchestrator.orchestratePerformanceReview(body.reviewData);
            return {
                success: result.success,
                response: result.data,
                message: result.message,
                compliance_notes: result.compliance_notes
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Performance review orchestration failed',
                error: error.message
            };
        }
    }
};
exports.AiAgentCoordinatorController = AiAgentCoordinatorController;
__decorate([
    (0, common_1.Get)('industrial-relations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Industrial Relations AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispute resolution prediction and case analysis' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getIndustrialRelations", null);
__decorate([
    (0, common_1.Get)('employee-relations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Employee Relations AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emotion detection and conflict mediation' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getEmployeeRelations", null);
__decorate([
    (0, common_1.Get)('foreign-workers-management'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Foreign Workers Management AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permit renewal and compliance assessment' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getForeignWorkersManagement", null);
__decorate([
    (0, common_1.Get)('compensation-benefits'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Compensation & Benefits AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary benchmarking and pay equity analysis' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getCompensationBenefits", null);
__decorate([
    (0, common_1.Get)('talent-acquisition'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Talent Acquisition AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resume parsing and candidate screening' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getTalentAcquisition", null);
__decorate([
    (0, common_1.Get)('learning-development'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Learning & Development AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Skills gap identification and personalized learning' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getLearningDevelopment", null);
__decorate([
    (0, common_1.Get)('performance-management'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Performance Management AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OKR tracking and bias detection' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getPerformanceManagement", null);
__decorate([
    (0, common_1.Get)('hr-analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HR Analytics AI Agent Features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Predictive insights and compliance monitoring' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiAgentCoordinatorController.prototype, "getHrAnalytics", null);
__decorate([
    (0, common_1.Post)('coordinate'),
    (0, swagger_1.ApiOperation)({ summary: 'Coordinate AI Agents for HR Tasks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coordinated AI agent response' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentCoordinatorController.prototype, "coordinateAgents", null);
__decorate([
    (0, common_1.Post)('employee-lifecycle'),
    (0, swagger_1.ApiOperation)({ summary: 'Orchestrate AI Agents for Complete Employee Lifecycle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multi-agent orchestration for employee lifecycle' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentCoordinatorController.prototype, "orchestrateEmployeeLifecycle", null);
__decorate([
    (0, common_1.Post)('compliance-audit'),
    (0, swagger_1.ApiOperation)({ summary: 'Orchestrate AI Agents for Compliance Audit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multi-agent compliance audit orchestration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentCoordinatorController.prototype, "orchestrateComplianceAudit", null);
__decorate([
    (0, common_1.Post)('workforce-planning'),
    (0, swagger_1.ApiOperation)({ summary: 'Orchestrate AI Agents for Workforce Planning' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multi-agent workforce planning orchestration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentCoordinatorController.prototype, "orchestrateWorkforcePlanning", null);
__decorate([
    (0, common_1.Post)('performance-review'),
    (0, swagger_1.ApiOperation)({ summary: 'Orchestrate AI Agents for Performance Review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multi-agent performance review orchestration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentCoordinatorController.prototype, "orchestratePerformanceReview", null);
exports.AiAgentCoordinatorController = AiAgentCoordinatorController = __decorate([
    (0, swagger_1.ApiTags)('AI Agent Coordinator'),
    (0, common_1.Controller)('ai-agent-coordinator'),
    __metadata("design:paramtypes", [])
], AiAgentCoordinatorController);
//# sourceMappingURL=ai-agent-coordinator.js.map