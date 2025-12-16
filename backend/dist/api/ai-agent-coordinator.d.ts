export declare class AiAgentCoordinatorController {
    private orchestrator;
    constructor();
    getIndustrialRelations(): {
        features: string[];
        compliance: string[];
    };
    getEmployeeRelations(): {
        features: string[];
        compliance: string[];
    };
    getForeignWorkersManagement(): {
        features: string[];
        compliance: string[];
    };
    getCompensationBenefits(): {
        features: string[];
        compliance: string[];
    };
    getTalentAcquisition(): {
        features: string[];
        compliance: string[];
    };
    getLearningDevelopment(): {
        features: string[];
        compliance: string[];
    };
    getPerformanceManagement(): {
        features: string[];
        compliance: string[];
    };
    getHrAnalytics(): {
        features: string[];
        reports: string[];
    };
    coordinateAgents(body: {
        task: string;
        module: string;
        data?: any;
        multi_agent?: boolean;
    }): Promise<{
        success: boolean;
        response: any;
        message: string;
        compliance_notes: string[];
        confidence_score: number;
        orchestration_metadata: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        response?: undefined;
        compliance_notes?: undefined;
        confidence_score?: undefined;
        orchestration_metadata?: undefined;
    }>;
    orchestrateEmployeeLifecycle(body: {
        employeeData: any;
    }): Promise<{
        success: boolean;
        response: any;
        message: string;
        compliance_notes: string[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        response?: undefined;
        compliance_notes?: undefined;
    }>;
    orchestrateComplianceAudit(body: {
        auditData: any;
    }): Promise<{
        success: boolean;
        response: any;
        message: string;
        compliance_notes: string[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        response?: undefined;
        compliance_notes?: undefined;
    }>;
    orchestrateWorkforcePlanning(body: {
        planningData: any;
    }): Promise<{
        success: boolean;
        response: any;
        message: string;
        compliance_notes: string[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        response?: undefined;
        compliance_notes?: undefined;
    }>;
    orchestratePerformanceReview(body: {
        reviewData: any;
    }): Promise<{
        success: boolean;
        response: any;
        message: string;
        compliance_notes: string[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        response?: undefined;
        compliance_notes?: undefined;
    }>;
}
