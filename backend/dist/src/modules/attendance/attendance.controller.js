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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const attendance_service_1 = require("./attendance.service");
const create_attendance_record_dto_1 = require("./dto/create-attendance-record.dto");
const update_attendance_record_dto_1 = require("./dto/update-attendance-record.dto");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    createAttendanceRecord(createAttendanceRecordDto) {
        return this.attendanceService.createAttendanceRecord(createAttendanceRecordDto);
    }
    findAllAttendanceRecords() {
        return this.attendanceService.findAllAttendanceRecords();
    }
    findAttendanceRecord(id) {
        return this.attendanceService.findAttendanceRecord(id);
    }
    updateAttendanceRecord(id, updateAttendanceRecordDto) {
        return this.attendanceService.updateAttendanceRecord(id, updateAttendanceRecordDto);
    }
    deleteAttendanceRecord(id) {
        return this.attendanceService.deleteAttendanceRecord(id);
    }
    findByEmployee(employeeId) {
        return this.attendanceService.findByEmployee(employeeId);
    }
    clockIn(employeeId) {
        return this.attendanceService.clockIn(employeeId);
    }
    clockOut(id) {
        return this.attendanceService.clockOut(id);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('records'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_record_dto_1.CreateAttendanceRecordDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "createAttendanceRecord", null);
__decorate([
    (0, common_1.Get)('records'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAllAttendanceRecords", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAttendanceRecord", null);
__decorate([
    (0, common_1.Patch)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_record_dto_1.UpdateAttendanceRecordDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "updateAttendanceRecord", null);
__decorate([
    (0, common_1.Delete)('records/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "deleteAttendanceRecord", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Post)('clock-in/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('clock-out/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "clockOut", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map