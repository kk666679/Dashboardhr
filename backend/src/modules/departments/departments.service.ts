import { Injectable } from '@nestjs/common';

// Database
import { PrismaService } from '../../database/prisma.service';

// DTOs
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        employees: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        employees: true,
      },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  async remove(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
