import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { ComplianceService } from './compliance.service';

// DTOs
import { CreateComplianceReportDto } from './dto/create-compliance-report.dto';
import { UpdateComplianceReportDto } from './dto/update-compliance-report.dto';

@Controller('compliance')
@UseGuards(RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('reports')
  createComplianceReport(@Body() createComplianceReportDto: CreateComplianceReportDto) {
    return this.complianceService.createComplianceReport(createComplianceReportDto);
  }

  @Get('reports')
  findAllComplianceReports() {
    return this.complianceService.findAllComplianceReports();
  }

  @Get('reports/:id')
  findComplianceReport(@Param('id') id: string) {
    return this.complianceService.findComplianceReport(id);
  }

  @Patch('reports/:id')
  updateComplianceReport(@Param('id') id: string, @Body() updateComplianceReportDto: UpdateComplianceReportDto) {
    return this.complianceService.updateComplianceReport(id, updateComplianceReportDto);
  }

  @Delete('reports/:id')
  deleteComplianceReport(@Param('id') id: string) {
    return this.complianceService.deleteComplianceReport(id);
  }

  @Get('check/:employeeId')
  checkCompliance(@Param('employeeId') employeeId: string) {
    return this.complianceService.checkCompliance(employeeId);
  }

  @Post('generate-report')
  generateComplianceReport() {
    return this.complianceService.generateComplianceReport();
  }
}
