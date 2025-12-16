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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AttendanceService = class AttendanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAttendanceRecord(createAttendanceRecordDto) {
        return this.prisma.attendanceRecord.create({
            data: createAttendanceRecordDto,
        });
    }
    async findAllAttendanceRecords() {
        return this.prisma.attendanceRecord.findMany({
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
    async findAttendanceRecord(id) {
        return this.prisma.attendanceRecord.findUnique({
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
    async updateAttendanceRecord(id, updateAttendanceRecordDto) {
        return this.prisma.attendanceRecord.update({
            where: { id },
            data: updateAttendanceRecordDto,
        });
    }
    async deleteAttendanceRecord(id) {
        return this.prisma.attendanceRecord.delete({
            where: { id },
        });
    }
    async findByEmployee(employeeId) {
        return this.prisma.attendanceRecord.findMany({
            where: { employeeId },
            include: {
                employee: {
                    include: {
                        user: true,
                        department: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async clockIn(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingRecord = await this.prisma.attendanceRecord.findFirst({
            where: {
                employeeId,
                date: today,
            },
        });
        if (existingRecord && existingRecord.checkIn) {
            throw new Error('Already clocked in today');
        }
        const checkInTime = new Date();
        if (existingRecord) {
            return this.prisma.attendanceRecord.update({
                where: { id: existingRecord.id },
                data: { checkIn: checkInTime },
            });
        }
        else {
            return this.prisma.attendanceRecord.create({
                data: {
                    employeeId,
                    date: today,
                    checkIn: checkInTime,
                    status: 'PRESENT',
                },
            });
        }
    }
    async clockOut(id) {
        const record = await this.prisma.attendanceRecord.findUnique({
            where: { id },
        });
        if (!record) {
            throw new Error('Attendance record not found');
        }
        if (!record.checkIn) {
            throw new Error('Cannot clock out without clocking in first');
        }
        const checkOutTime = new Date();
        const workHours = (checkOutTime.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60);
        const expectedStart = new Date(record.checkIn);
        expectedStart.setHours(9, 0, 0, 0);
        const expectedEnd = new Date(record.checkIn);
        expectedEnd.setHours(17, 0, 0, 0);
        const lateMinutes = record.checkIn > expectedStart ? (record.checkIn.getTime() - expectedStart.getTime()) / (1000 * 60) : 0;
        const earlyLeave = checkOutTime < expectedEnd ? (expectedEnd.getTime() - checkOutTime.getTime()) / (1000 * 60) : 0;
        return this.prisma.attendanceRecord.update({
            where: { id },
            data: {
                checkOut: checkOutTime,
                workHours,
                lateMinutes,
                earlyLeave,
            },
        });
    }
    async getAttendanceSummary(employeeId, startDate, endDate) {
        const records = await this.prisma.attendanceRecord.findMany({
            where: {
                employeeId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalDays = records.length;
        const presentDays = records.filter(r => r.status === 'PRESENT').length;
        const absentDays = records.filter(r => r.status === 'ABSENT').length;
        const lateDays = records.filter(r => r.lateMinutes && r.lateMinutes > 0).length;
        const totalWorkHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);
        return {
            employeeId,
            period: { startDate, endDate },
            summary: {
                totalDays,
                presentDays,
                absentDays,
                lateDays,
                totalWorkHours,
                attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
            },
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map