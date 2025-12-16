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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PayrollService = class PayrollService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPayrollRecordDto) {
        return this.prisma.payrollRecord.create({
            data: createPayrollRecordDto,
        });
    }
    async findAll() {
        return this.prisma.payrollRecord.findMany({
            include: {
                employee: {
                    include: {
                        user: true,
                        department: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.payrollRecord.findUnique({
            where: { id },
            include: {
                employee: {
                    include: {
                        user: true,
                        department: true,
                    },
                },
            },
        });
    }
    async update(id, updatePayrollRecordDto) {
        return this.prisma.payrollRecord.update({
            where: { id },
            data: updatePayrollRecordDto,
        });
    }
    async remove(id) {
        return this.prisma.payrollRecord.delete({
            where: { id },
        });
    }
    async findByEmployee(employeeId) {
        return this.prisma.payrollRecord.findMany({
            where: { employeeId },
            include: {
                employee: {
                    include: {
                        user: true,
                        department: true,
                    },
                },
            },
            orderBy: { year: 'desc' },
        });
    }
    async findByMonthYear(month, year) {
        return this.prisma.payrollRecord.findMany({
            where: { month, year },
            include: {
                employee: {
                    include: {
                        user: true,
                        department: true,
                    },
                },
            },
        });
    }
    async processPayroll(employeeId, month, year) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
            include: { department: true },
        });
        if (!employee) {
            throw new Error('Employee not found');
        }
        const basicSalary = employee.position === 'MANAGER' ? 5000 : 3000;
        const epfEmployee = basicSalary * 0.11;
        const epfEmployer = basicSalary * 0.12;
        const socso = 0.4;
        const eis = 0.2;
        const incomeTax = basicSalary * 0.03;
        const totalDeductions = epfEmployee + socso + eis + incomeTax;
        const netSalary = basicSalary - totalDeductions;
        const payrollData = {
            employeeId,
            month,
            year,
            basicSalary,
            allowances: 0,
            overtime: 0,
            bonus: 0,
            commission: 0,
            grossSalary: basicSalary,
            epfEmployee,
            epfEmployer,
            socso,
            eis,
            incomeTax,
            otherDeductions: 0,
            totalDeductions,
            netSalary,
            status: 'PROCESSED',
        };
        return this.prisma.payrollRecord.create({
            data: payrollData,
        });
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map