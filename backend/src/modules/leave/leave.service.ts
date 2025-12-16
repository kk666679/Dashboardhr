import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.leaveRequest.create({ data });
  }

  async findAll() {
    return this.prisma.leaveRequest.findMany();
  }

  async findOne(id: string) {
    return this.prisma.leaveRequest.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.leaveRequest.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.leaveRequest.delete({ where: { id } });
  }

  async approve(id: string) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async reject(id: string) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}
