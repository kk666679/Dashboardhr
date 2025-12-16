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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const compliance_service_1 = require("./compliance.service");
const create_compliance_report_dto_1 = require("./dto/create-compliance-report.dto");
const update_compliance_report_dto_1 = require("./dto/update-compliance-report.dto");
let ComplianceController = class ComplianceController {
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    createComplianceReport(createComplianceReportDto) {
        return this.complianceService.createComplianceReport(createComplianceReportDto);
    }
    findAllComplianceReports() {
        return this.complianceService.findAllComplianceReports();
    }
    findComplianceReport(id) {
        return this.complianceService.findComplianceReport(id);
    }
    updateComplianceReport(id, updateComplianceReportDto) {
        return this.complianceService.updateComplianceReport(id, updateComplianceReportDto);
    }
    deleteComplianceReport(id) {
        return this.complianceService.deleteComplianceReport(id);
    }
    checkCompliance(employeeId) {
        return this.complianceService.checkCompliance(employeeId);
    }
    generateComplianceReport() {
        return this.complianceService.generateComplianceReport();
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Post)('reports'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_compliance_report_dto_1.CreateComplianceReportDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "createComplianceReport", null);
__decorate([
    (0, common_1.Get)('reports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "findAllComplianceReports", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "findComplianceReport", null);
__decorate([
    (0, common_1.Patch)('reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_compliance_report_dto_1.UpdateComplianceReportDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "updateComplianceReport", null);
__decorate([
    (0, common_1.Delete)('reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "deleteComplianceReport", null);
__decorate([
    (0, common_1.Get)('check/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "checkCompliance", null);
__decorate([
    (0, common_1.Post)('generate-report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "generateComplianceReport", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, common_1.Controller)('compliance'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map