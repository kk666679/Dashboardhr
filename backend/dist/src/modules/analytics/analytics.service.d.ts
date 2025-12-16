export declare class AnalyticsService {
    createReport(createAnalyticsReportDto: any): {
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
    generateEmployeeSummaryReport(): {
        message: string;
        data: {};
    };
    generateLeaveReport(): {
        message: string;
        data: {};
    };
    generatePayrollReport(): {
        message: string;
        data: {};
    };
}
