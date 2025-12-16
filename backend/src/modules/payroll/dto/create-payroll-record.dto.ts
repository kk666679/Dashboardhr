import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreatePayrollRecordDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  payPeriodStart: string;

  @IsDateString()
  payPeriodEnd: string;

  @IsNumber()
  basicSalary: number;

  @IsOptional()
  @IsNumber()
  allowances?: number;

  @IsOptional()
  @IsNumber()
  deductions?: number;

  @IsOptional()
  @IsNumber()
  overtime?: number;

  @IsOptional()
  @IsNumber()
  epf?: number;

  @IsOptional()
  @IsNumber()
  socso?: number;

  @IsOptional()
  @IsNumber()
  eis?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  netSalary?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
