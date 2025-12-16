import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateComplianceReportDto {
  @IsString()
  employeeId: string;

  @IsString()
  reportType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  findings?: any;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
