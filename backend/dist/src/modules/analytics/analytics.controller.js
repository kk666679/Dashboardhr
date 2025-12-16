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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const analytics_service_1 = require("./analytics.service");
const create_analytics_report_dto_1 = require("./dto/create-analytics-report.dto");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    createReport(createAnalyticsReportDto) {
        return this.analyticsService.createReport(createAnalyticsReportDto);
    }
    findAllReports() {
        return this.analyticsService.findAllReports();
    }
    findReport(id) {
        return this.analyticsService.findReport(id);
    }
    getEmployeeSummary() {
        return this.analyticsService.generateEmployeeSummaryReport();
    }
    getLeaveReport() {
        return this.analyticsService.generateLeaveReport();
    }
    getPayrollReport() {
        return this.analyticsService.generatePayrollReport();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('reports'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_analytics_report_dto_1.CreateAnalyticsReportDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)('reports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "findAllReports", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "findReport", null);
__decorate([
    (0, common_1.Get)('employee-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getEmployeeSummary", null);
__decorate([
    (0, common_1.Get)('leave-report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getLeaveReport", null);
__decorate([
    (0, common_1.Get)('payroll-report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getPayrollReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map