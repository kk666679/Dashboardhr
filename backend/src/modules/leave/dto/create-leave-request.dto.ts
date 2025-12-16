import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsString()
  employeeId: string;

  @IsString()
  leaveTypeId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  daysRequested?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  approverId?: string;
}
