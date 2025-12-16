import { Injectable } from '@nestjs/common';

// Database
import { PrismaService } from '../../database/prisma.service';

// DTOs
import { CreatePayrollRecordDto } from './dto/create-payroll-record.dto';
import { UpdatePayrollRecordDto } from './dto/update-payroll-record.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async create(createPayrollRecordDto: CreatePayrollRecordDto) {
    return this.prisma.payrollRecord.create({
      data: createPayrollRecordDto,
    });
  }

  async findAll() {
    return this.prisma.payrollRecord.findMany({
      include: {
        employee: {
          include: {
            user: true,
            department: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.payrollRecord.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: true,
            department: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePayrollRecordDto: UpdatePayrollRecordDto) {
    return this.prisma.payrollRecord.update({
      where: { id },
      data: updatePayrollRecordDto,
    });
  }

  async remove(id: string) {
    return this.prisma.payrollRecord.delete({
      where: { id },
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.payrollRecord.findMany({
      where: { employeeId },
      include: {
        employee: {
          include: {
            user: true,
            department: true,
          },
        },
      },
      orderBy: { year: 'desc' },
    });
  }

  async findByMonthYear(month: number, year: number) {
    return this.prisma.payrollRecord.findMany({
      where: { month, year },
      include: {
        employee: {
          include: {
            user: true,
            department: true,
          },
        },
      },
    });
  }

  async processPayroll(employeeId: string, month: number, year: number) {
    // Get employee details
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: { department: true },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Calculate basic salary (simplified - in real app this would be more complex)
    const basicSalary = employee.position === 'MANAGER' ? 5000 : 3000;

    // Calculate deductions (simplified)
    const epfEmployee = basicSalary * 0.11;
    const epfEmployer = basicSalary * 0.12;
    const socso = 0.4; // Fixed amount for simplicity
    const eis = 0.2;
    const incomeTax = basicSalary * 0.03; // Simplified tax calculation

    const totalDeductions = epfEmployee + socso + eis + incomeTax;
    const netSalary = basicSalary - totalDeductions;

    const payrollData = {
      employeeId,
      month,
      year,
      basicSalary,
      allowances: 0,
      overtime: 0,
      bonus: 0,
      commission: 0,
      grossSalary: basicSalary,
      epfEmployee,
      epfEmployer,
      socso,
      eis,
      incomeTax,
      otherDeductions: 0,
      totalDeductions,
      netSalary,
      status: 'PROCESSED' as const,
    };

    return this.prisma.payrollRecord.create({
      data: payrollData,
    });
  }
}
