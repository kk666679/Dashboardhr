import { AttendanceService } from './attendance.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    createAttendanceRecord(createAttendanceRecordDto: CreateAttendanceRecordDto): Promise<any>;
    findAllAttendanceRecords(): Promise<any>;
    findAttendanceRecord(id: string): Promise<any>;
    updateAttendanceRecord(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto): Promise<any>;
    deleteAttendanceRecord(id: string): Promise<any>;
    findByEmployee(employeeId: string): Promise<any>;
    clockIn(employeeId: string): Promise<any>;
    clockOut(id: string): Promise<any>;
}
