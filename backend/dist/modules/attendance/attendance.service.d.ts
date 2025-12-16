import { PrismaService } from '../../database/prisma.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createAttendanceRecord(createAttendanceRecordDto: CreateAttendanceRecordDto): Promise<any>;
    findAllAttendanceRecords(): Promise<any>;
    findAttendanceRecord(id: string): Promise<any>;
    updateAttendanceRecord(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto): Promise<any>;
    deleteAttendanceRecord(id: string): Promise<any>;
    findByEmployee(employeeId: string): Promise<any>;
    clockIn(employeeId: string): Promise<any>;
    clockOut(id: string): Promise<any>;
    getAttendanceSummary(employeeId: string, startDate: Date, endDate: Date): Promise<{
        employeeId: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalDays: any;
            presentDays: any;
            absentDays: any;
            lateDays: any;
            totalWorkHours: any;
            attendancePercentage: number;
        };
    }>;
}
