import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
