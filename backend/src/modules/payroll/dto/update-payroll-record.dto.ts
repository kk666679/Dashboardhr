import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollRecordDto } from './create-payroll-record.dto';

export class UpdatePayrollRecordDto extends PartialType(CreatePayrollRecordDto) {}
