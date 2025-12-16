import { ComplianceService } from './compliance.service';
import { CreateComplianceReportDto } from './dto/create-compliance-report.dto';
import { UpdateComplianceReportDto } from './dto/update-compliance-report.dto';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    createComplianceReport(createComplianceReportDto: CreateComplianceReportDto): Promise<any>;
    findAllComplianceReports(): Promise<any>;
    findComplianceReport(id: string): Promise<any>;
    updateComplianceReport(id: string, updateComplianceReportDto: UpdateComplianceReportDto): Promise<any>;
    deleteComplianceReport(id: string): Promise<any>;
    checkCompliance(employeeId: string): Promise<{
        employeeId: string;
        isCompliant: boolean;
        issues: any[];
    }>;
    generateComplianceReport(): Promise<{
        reportId: string;
        generatedAt: Date;
        summary: string;
    }>;
}
