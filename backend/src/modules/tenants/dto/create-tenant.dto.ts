import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  companyRegNo?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  maxEmployees?: number;

  @IsOptional()
  @IsNumber()
  maxStorage?: number;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;
}
