"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
let AnalyticsService = class AnalyticsService {
    createReport(createAnalyticsReportDto) {
        return { message: 'Report created', data: createAnalyticsReportDto };
    }
    findAllReports() {
        return { message: 'All reports', data: [] };
    }
    findReport(id) {
        return { message: `Report ${id}`, data: {} };
    }
    generateEmployeeSummaryReport() {
        return { message: 'Employee summary report', data: {} };
    }
    generateLeaveReport() {
        return { message: 'Leave report', data: {} };
    }
    generatePayrollReport() {
        return { message: 'Payroll report', data: {} };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map