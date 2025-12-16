import { Injectable } from '@nestjs/common';

// Database
import { PrismaService } from '../../database/prisma.service';

// DTOs
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        user: true,
        department: true,
        leaveRequests: true,
        attendanceRecords: true,
        payrollRecords: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        leaveRequests: true,
        attendanceRecords: true,
        payrollRecords: true,
      },
    });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
