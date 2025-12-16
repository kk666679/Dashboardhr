import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { PayrollService } from './payroll.service';

// DTOs
import { CreatePayrollRecordDto } from './dto/create-payroll-record.dto';
import { UpdatePayrollRecordDto } from './dto/update-payroll-record.dto';

@Controller('payroll')
@UseGuards(RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('records')
  create(@Body() createPayrollRecordDto: CreatePayrollRecordDto) {
    return this.payrollService.create(createPayrollRecordDto);
  }

  @Get('records')
  findAll() {
    return this.payrollService.findAll();
  }

  @Get('records/:id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  @Patch('records/:id')
  update(@Param('id') id: string, @Body() updatePayrollRecordDto: UpdatePayrollRecordDto) {
    return this.payrollService.update(id, updatePayrollRecordDto);
  }

  @Delete('records/:id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.payrollService.findByEmployee(employeeId);
  }

  @Get('month')
  findByMonthYear(@Query('month') month: number, @Query('year') year: number) {
    return this.payrollService.findByMonthYear(month, year);
  }

  @Post('process/:employeeId')
  processPayroll(
    @Param('employeeId') employeeId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.payrollService.processPayroll(employeeId, month, year);
  }
}
