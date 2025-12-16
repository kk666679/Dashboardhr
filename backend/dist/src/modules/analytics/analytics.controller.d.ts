import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsReportDto } from './dto/create-analytics-report.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    createReport(createAnalyticsReportDto: CreateAnalyticsReportDto): {
        message: string;
        data: any;
    };
    findAllReports(): {
        message: string;
        data: any[];
    };
    findReport(id: string): {
        message: string;
        data: {};
    };
    getEmployeeSummary(): {
        message: string;
        data: {};
    };
    getLeaveReport(): {
        message: string;
        data: {};
    };
    getPayrollReport(): {
        message: string;
        data: {};
    };
}
