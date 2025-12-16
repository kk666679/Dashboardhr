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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const leave_service_1 = require("./leave.service");
const create_leave_request_dto_1 = require("./dto/create-leave-request.dto");
const update_leave_request_dto_1 = require("./dto/update-leave-request.dto");
let LeaveController = class LeaveController {
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    createLeaveRequest(createLeaveRequestDto) {
        return this.leaveService.createLeaveRequest(createLeaveRequestDto);
    }
    findAllLeaveRequests() {
        return this.leaveService.findAllLeaveRequests();
    }
    findLeaveRequest(id) {
        return this.leaveService.findLeaveRequest(id);
    }
    updateLeaveRequest(id, updateLeaveRequestDto) {
        return this.leaveService.updateLeaveRequest(id, updateLeaveRequestDto);
    }
    deleteLeaveRequest(id) {
        return this.leaveService.deleteLeaveRequest(id);
    }
    findAllLeaveTypes() {
        return this.leaveService.findAllLeaveTypes();
    }
    createLeaveType(data) {
        return this.leaveService.createLeaveType(data);
    }
    findLeaveBalances(employeeId) {
        return this.leaveService.findLeaveBalances(employeeId);
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)('requests'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_request_dto_1.CreateLeaveRequestDto]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "findAllLeaveRequests", null);
__decorate([
    (0, common_1.Get)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "findLeaveRequest", null);
__decorate([
    (0, common_1.Patch)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_leave_request_dto_1.UpdateLeaveRequestDto !== "undefined" && update_leave_request_dto_1.UpdateLeaveRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "updateLeaveRequest", null);
__decorate([
    (0, common_1.Delete)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "deleteLeaveRequest", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "findAllLeaveTypes", null);
__decorate([
    (0, common_1.Post)('types'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createLeaveType", null);
__decorate([
    (0, common_1.Get)('balances/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "findLeaveBalances", null);
exports.LeaveController = LeaveController = __decorate([
    (0, common_1.Controller)('leave'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof leave_service_1.LeaveService !== "undefined" && leave_service_1.LeaveService) === "function" ? _a : Object])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map