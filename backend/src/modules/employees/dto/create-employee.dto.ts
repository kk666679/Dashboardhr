import { IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  userId: string;

  @IsString()
  employeeCode: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  icNumber?: string;

  @IsString()
  departmentId: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsDateString()
  joinDate: string;

  @IsOptional()
  @IsDateString()
  confirmationDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsOptional()
  @IsString()
  epfNumber?: string;

  @IsOptional()
  @IsString()
  socsoNumber?: string;

  @IsOptional()
  @IsString()
  eisNumber?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;
}
