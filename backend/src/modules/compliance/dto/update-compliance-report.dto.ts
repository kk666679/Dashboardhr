import { PartialType } from '@nestjs/mapped-types';
import { CreateComplianceReportDto } from './create-compliance-report.dto';

export class UpdateComplianceReportDto extends PartialType(CreateComplianceReportDto) {}
