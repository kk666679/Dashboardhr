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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ComplianceService = class ComplianceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createComplianceReport(createComplianceReportDto) {
        return this.prisma.complianceReport.create({
            data: createComplianceReportDto,
        });
    }
    async findAllComplianceReports() {
        return this.prisma.complianceReport.findMany({
            include: {
                employee: true,
            },
        });
    }
    async findComplianceReport(id) {
        return this.prisma.complianceReport.findUnique({
            where: { id },
            include: {
                employee: true,
            },
        });
    }
    async updateComplianceReport(id, updateComplianceReportDto) {
        return this.prisma.complianceReport.update({
            where: { id },
            data: updateComplianceReportDto,
        });
    }
    async deleteComplianceReport(id) {
        return this.prisma.complianceReport.delete({
            where: { id },
        });
    }
    async checkCompliance(employeeId) {
        return {
            employeeId,
            isCompliant: true,
            issues: [],
        };
    }
    async generateComplianceReport() {
        return {
            reportId: 'generated-report-id',
            generatedAt: new Date(),
            summary: 'Compliance report generated successfully',
        };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map