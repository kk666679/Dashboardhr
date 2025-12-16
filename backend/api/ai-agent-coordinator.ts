import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrchestratorAgent } from '../src/modules/ai-agents/orchestrator-agent';
import { AgentContext } from '../src/modules/ai-agents/base-agent';

@ApiTags('AI Agent Coordinator')
@Controller('ai-agent-coordinator')
export class AiAgentCoordinatorController {
  private orchestrator: OrchestratorAgent;

  constructor() {
    // Initialize with Malaysian HR context
    const context: AgentContext = {
      language: 'en',
      compliance: true,
      tenantId: 'default'
    };
    this.orchestrator = new OrchestratorAgent(context);
  }

  @Get('industrial-relations')
  @ApiOperation({ summary: 'Get Industrial Relations AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Dispute resolution prediction and case analysis' })
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

  @Get('employee-relations')
  @ApiOperation({ summary: 'Get Employee Relations AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Emotion detection and conflict mediation' })
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

  @Get('foreign-workers-management')
  @ApiOperation({ summary: 'Get Foreign Workers Management AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Permit renewal and compliance assessment' })
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

  @Get('compensation-benefits')
  @ApiOperation({ summary: 'Get Compensation & Benefits AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Salary benchmarking and pay equity analysis' })
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

  @Get('talent-acquisition')
  @ApiOperation({ summary: 'Get Talent Acquisition AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Resume parsing and candidate screening' })
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

  @Get('learning-development')
  @ApiOperation({ summary: 'Get Learning & Development AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Skills gap identification and personalized learning' })
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

  @Get('performance-management')
  @ApiOperation({ summary: 'Get Performance Management AI Agent Features' })
  @ApiResponse({ status: 200, description: 'OKR tracking and bias detection' })
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

  @Get('hr-analytics')
  @ApiOperation({ summary: 'Get HR Analytics AI Agent Features' })
  @ApiResponse({ status: 200, description: 'Predictive insights and compliance monitoring' })
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

  @Post('coordinate')
  @ApiOperation({ summary: 'Coordinate AI Agents for HR Tasks' })
  @ApiResponse({ status: 200, description: 'Coordinated AI agent response' })
  async coordinateAgents(@Body() body: { task: string; module: string; data?: any; multi_agent?: boolean }) {
    try {
      const { task, module, data = {}, multi_agent = false } = body;

      // Use the orchestrator agent for intelligent coordination
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
        orchestration_metadata: (result as any).orchestration_metadata
      };
    } catch (error) {
      console.error('Agent coordination error:', error);
      return {
        success: false,
        message: 'Failed to coordinate AI agents',
        error: error.message
      };
    }
  }

  @Post('employee-lifecycle')
  @ApiOperation({ summary: 'Orchestrate AI Agents for Complete Employee Lifecycle' })
  @ApiResponse({ status: 200, description: 'Multi-agent orchestration for employee lifecycle' })
  async orchestrateEmployeeLifecycle(@Body() body: { employeeData: any }) {
    try {
      const result = await this.orchestrator.orchestrateEmployeeLifecycle(body.employeeData);
      return {
        success: result.success,
        response: result.data,
        message: result.message,
        compliance_notes: result.compliance_notes
      };
    } catch (error) {
      return {
        success: false,
        message: 'Employee lifecycle orchestration failed',
        error: error.message
      };
    }
  }

  @Post('compliance-audit')
  @ApiOperation({ summary: 'Orchestrate AI Agents for Compliance Audit' })
  @ApiResponse({ status: 200, description: 'Multi-agent compliance audit orchestration' })
  async orchestrateComplianceAudit(@Body() body: { auditData: any }) {
    try {
      const result = await this.orchestrator.orchestrateComplianceAudit(body.auditData);
      return {
        success: result.success,
        response: result.data,
        message: result.message,
        compliance_notes: result.compliance_notes
      };
    } catch (error) {
      return {
        success: false,
        message: 'Compliance audit orchestration failed',
        error: error.message
      };
    }
  }

  @Post('workforce-planning')
  @ApiOperation({ summary: 'Orchestrate AI Agents for Workforce Planning' })
  @ApiResponse({ status: 200, description: 'Multi-agent workforce planning orchestration' })
  async orchestrateWorkforcePlanning(@Body() body: { planningData: any }) {
    try {
      const result = await this.orchestrator.orchestrateWorkforcePlanning(body.planningData);
      return {
        success: result.success,
        response: result.data,
        message: result.message,
        compliance_notes: result.compliance_notes
      };
    } catch (error) {
      return {
        success: false,
        message: 'Workforce planning orchestration failed',
        error: error.message
      };
    }
  }

  @Post('performance-review')
  @ApiOperation({ summary: 'Orchestrate AI Agents for Performance Review' })
  @ApiResponse({ status: 200, description: 'Multi-agent performance review orchestration' })
  async orchestratePerformanceReview(@Body() body: { reviewData: any }) {
    try {
      const result = await this.orchestrator.orchestratePerformanceReview(body.reviewData);
      return {
        success: result.success,
        response: result.data,
        message: result.message,
        compliance_notes: result.compliance_notes
      };
    } catch (error) {
      return {
        success: false,
        message: 'Performance review orchestration failed',
        error: error.message
      };
    }
  }
}
