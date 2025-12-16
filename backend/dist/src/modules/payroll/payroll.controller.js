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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const payroll_service_1 = require("./payroll.service");
const create_payroll_record_dto_1 = require("./dto/create-payroll-record.dto");
const update_payroll_record_dto_1 = require("./dto/update-payroll-record.dto");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    create(createPayrollRecordDto) {
        return this.payrollService.create(createPayrollRecordDto);
    }
    findAll() {
        return this.payrollService.findAll();
    }
    findOne(id) {
        return this.payrollService.findOne(id);
    }
    update(id, updatePayrollRecordDto) {
        return this.payrollService.update(id, updatePayrollRecordDto);
    }
    remove(id) {
        return this.payrollService.remove(id);
    }
    findByEmployee(employeeId) {
        return this.payrollService.findByEmployee(employeeId);
    }
    findByMonthYear(month, year) {
        return this.payrollService.findByMonthYear(month, year);
    }
    processPayroll(employeeId, month, year) {
        return this.payrollService.processPayroll(employeeId, month, year);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)('records'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_record_dto_1.CreatePayrollRecordDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('records'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payroll_record_dto_1.UpdatePayrollRecordDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)('month'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findByMonthYear", null);
__decorate([
    (0, common_1.Post)('process/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "processPayroll", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map