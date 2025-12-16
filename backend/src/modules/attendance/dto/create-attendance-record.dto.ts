import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateAttendanceRecordDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsDateString()
  clockInTime?: string;

  @IsOptional()
  @IsDateString()
  clockOutTime?: string;

  @IsOptional()
  @IsNumber()
  hoursWorked?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
