import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { AnalyticsService } from './analytics.service';

// DTOs
import { CreateAnalyticsReportDto } from './dto/create-analytics-report.dto';

@Controller('analytics')
@UseGuards(RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('reports')
  createReport(@Body() createAnalyticsReportDto: CreateAnalyticsReportDto) {
    return this.analyticsService.createReport(createAnalyticsReportDto);
  }

  @Get('reports')
  findAllReports() {
    return this.analyticsService.findAllReports();
  }

  @Get('reports/:id')
  findReport(@Param('id') id: string) {
    return this.analyticsService.findReport(id);
  }

  @Get('employee-summary')
  getEmployeeSummary() {
    return this.analyticsService.generateEmployeeSummaryReport();
  }

  @Get('leave-report')
  getLeaveReport() {
    return this.analyticsService.generateLeaveReport();
  }

  @Get('payroll-report')
  getPayrollReport() {
    return this.analyticsService.generatePayrollReport();
  }
}
