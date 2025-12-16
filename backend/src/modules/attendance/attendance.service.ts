import { Injectable } from '@nestjs/common';

// Database
import { PrismaService } from '../../database/prisma.service';

// DTOs
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendanceRecord(createAttendanceRecordDto: CreateAttendanceRecordDto) {
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

  async findAttendanceRecord(id: string) {
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

  async updateAttendanceRecord(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto) {
    return this.prisma.attendanceRecord.update({
      where: { id },
      data: updateAttendanceRecordDto,
    });
  }

  async deleteAttendanceRecord(id: string) {
    return this.prisma.attendanceRecord.delete({
      where: { id },
    });
  }

  async findByEmployee(employeeId: string) {
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

  async clockIn(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
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
    } else {
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

  async clockOut(id: string) {
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

    // Calculate late minutes and early leave
    const expectedStart = new Date(record.checkIn);
    expectedStart.setHours(9, 0, 0, 0); // 9 AM start
    const expectedEnd = new Date(record.checkIn);
    expectedEnd.setHours(17, 0, 0, 0); // 5 PM end

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

  async getAttendanceSummary(employeeId: string, startDate: Date, endDate: Date) {
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
}
