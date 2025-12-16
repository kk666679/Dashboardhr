import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsReportDto } from './dto/create-analytics-report.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    createReport(createAnalyticsReportDto: CreateAnalyticsReportDto): any;
    findAllReports(): any;
    findReport(id: string): any;
    getEmployeeSummary(): any;
    getLeaveReport(): any;
    getPayrollReport(): any;
}
