import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { AttendanceService } from './attendance.service';

// DTOs
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Controller('attendance')
@UseGuards(RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('records')
  createAttendanceRecord(@Body() createAttendanceRecordDto: CreateAttendanceRecordDto) {
    return this.attendanceService.createAttendanceRecord(createAttendanceRecordDto);
  }

  @Get('records')
  findAllAttendanceRecords() {
    return this.attendanceService.findAllAttendanceRecords();
  }

  @Get('records/:id')
  findAttendanceRecord(@Param('id') id: string) {
    return this.attendanceService.findAttendanceRecord(id);
  }

  @Patch('records/:id')
  updateAttendanceRecord(@Param('id') id: string, @Body() updateAttendanceRecordDto: UpdateAttendanceRecordDto) {
    return this.attendanceService.updateAttendanceRecord(id, updateAttendanceRecordDto);
  }

  @Delete('records/:id')
  deleteAttendanceRecord(@Param('id') id: string) {
    return this.attendanceService.deleteAttendanceRecord(id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.attendanceService.findByEmployee(employeeId);
  }

  @Post('clock-in/:employeeId')
  clockIn(@Param('employeeId') employeeId: string) {
    return this.attendanceService.clockIn(employeeId);
  }

  @Post('clock-out/:id')
  clockOut(@Param('id') id: string) {
    return this.attendanceService.clockOut(id);
  }
}
