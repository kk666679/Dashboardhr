export declare class CreatePayrollRecordDto {
    employeeId: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    basicSalary: number;
    allowances?: number;
    deductions?: number;
    overtime?: number;
    epf?: number;
    socso?: number;
    eis?: number;
    tax?: number;
    netSalary?: number;
    status?: string;
}
