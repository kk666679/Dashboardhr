import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateAnalyticsReportDto {
  @IsString()
  reportType: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsObject()
  filters?: any;

  @IsOptional()
  @IsString()
  generatedBy?: string;
}
