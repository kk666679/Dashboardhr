import { PayrollService } from './payroll.service';
import { CreatePayrollRecordDto } from './dto/create-payroll-record.dto';
import { UpdatePayrollRecordDto } from './dto/update-payroll-record.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    create(createPayrollRecordDto: CreatePayrollRecordDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePayrollRecordDto: UpdatePayrollRecordDto): Promise<any>;
    remove(id: string): Promise<any>;
    findByEmployee(employeeId: string): Promise<any>;
    findByMonthYear(month: number, year: number): Promise<any>;
    processPayroll(employeeId: string, month: number, year: number): Promise<any>;
}
